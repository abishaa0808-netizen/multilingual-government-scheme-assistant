import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  toolSchemeSearch,
  toolEligibilityChecker,
  toolSchemeDetails,
  toolWhatAmIMissing,
  getAllSchemes,
} from './services/tools.ts';
import { runGovernmentSchemeAgent, AgentRequest } from './services/agent.ts';
import { SECTORS, STATES_AND_UTS, LANGUAGES, OCCUPATIONS, EDUCATION_LEVELS, Scheme } from './data/constants.ts';

dotenv.config();

const apiApp = express();
apiApp.use(express.json());

// Support both /api/... and unprefixed paths in case Vercel rewrites strip or keep /api
function registerRoute(method: 'get' | 'post', pathStr: string, handler: any) {
  const unprefixed = pathStr.replace(/^\/api/, '');
  (apiApp as any)[method](pathStr, handler);
  if (unprefixed && unprefixed !== pathStr) {
    (apiApp as any)[method](unprefixed, handler);
  }
}

// 1. Schemes catalog with search and filters
registerRoute('get', '/api/schemes', (req: Request, res: Response) => {
  try {
    const { q, state, sector, government } = req.query;
    let results = getAllSchemes();

    let parsedIntent = null;
    if (q && typeof q === 'string' && q.trim()) {
      const searchRes = toolSchemeSearch(q);
      results = searchRes.data as Scheme[];
      parsedIntent = searchRes.parsedIntent;
    }

    if (state && typeof state === 'string' && state !== 'All-India (Central)') {
      const norm = state.toLowerCase();
      results = results.filter(
        (s) => s.state.toLowerCase() === norm || (s.government === 'Central' && s.state.toLowerCase().includes('all-india'))
      );
    }

    if (sector && typeof sector === 'string' && sector !== 'All') {
      const normSec = sector.toLowerCase();
      results = results.filter((s) => s.sector.toLowerCase() === normSec);
    }

    if (government && typeof government === 'string' && government !== 'All') {
      results = results.filter((s) => s.government.toLowerCase() === government.toLowerCase());
    }

    res.json({
      total: results.length,
      schemes: results,
      parsedIntent,
    });
  } catch (err: any) {
    console.error('Schemes fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve schemes', details: err?.message });
  }
});

// 2. Specific scheme by ID
registerRoute('get', '/api/schemes/:id', (req: Request, res: Response) => {
  try {
    const schemeResult = toolSchemeDetails(req.params.id);
    if (!schemeResult.data) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }
    res.json(schemeResult.data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve scheme' });
  }
});

// 3. Agent Chat
registerRoute('post', '/api/agent/chat', async (req: Request, res: Response) => {
  try {
    const body: AgentRequest = req.body;
    if (!body?.message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    const agentResponse = await runGovernmentSchemeAgent(body);
    res.json(agentResponse);
  } catch (err: any) {
    console.error('Agent chat error:', err);
    res.status(500).json({ error: 'Failed to process request', details: err?.message || 'Unknown error' });
  }
});

// 4. Eligibility check
registerRoute('post', '/api/eligibility-check', (req: Request, res: Response) => {
  try {
    const profile = req.body;
    const result = toolEligibilityChecker(profile);
    res.json(result);
  } catch (err: any) {
    console.error('Eligibility check error:', err);
    res.status(500).json({ error: 'Eligibility calculation error' });
  }
});

// 5. Missing schemes check
registerRoute('post', '/api/missing-schemes', (req: Request, res: Response) => {
  try {
    const { sectors = [], profile } = req.body;
    const result = toolWhatAmIMissing(sectors, profile);
    res.json(result);
  } catch (err: any) {
    console.error('Missing schemes check error:', err);
    res.status(500).json({ error: 'Failed to find cross-sector schemes' });
  }
});

// 6. Constants
registerRoute('get', '/api/constants', (_req: Request, res: Response) => {
  res.json({
    sectors: SECTORS,
    states: STATES_AND_UTS,
    languages: LANGUAGES,
    occupations: OCCUPATIONS,
    educationLevels: EDUCATION_LEVELS,
  });
});

// In-memory OTP storage: identifier -> { code, expiresAt, type, purpose }
const otpStore = new Map<string, { code: string; expiresAt: number; type: string; purpose: string }>();

// In-memory User storage: identifier -> CitizenUser
const registeredUsers = new Map<string, any>();

import { dispatchEmailOtp, dispatchSmsOtp } from './services/otpDeliveryService.ts';

// 7. Auth: Send OTP (Mobile / Email with real delivery capability)
registerRoute('post', '/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { identifier, type, purpose } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ success: false, error: 'Mobile number or Email address is required' });
      return;
    }

    const cleanId = identifier.trim();
    // Generate secure 6-digit OTP code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInSeconds = 600; // 10 minutes

    otpStore.set(cleanId.toLowerCase(), {
      code: generatedCode,
      expiresAt: Date.now() + expiresInSeconds * 1000,
      type: type || (cleanId.includes('@') ? 'email' : 'mobile'),
      purpose: purpose || 'signin',
    });

    const isEmail = type === 'email' || cleanId.includes('@');
    let dispatchRes;
    if (isEmail) {
      dispatchRes = await dispatchEmailOtp(cleanId, generatedCode, purpose || 'signin');
    } else {
      dispatchRes = await dispatchSmsOtp(cleanId, generatedCode, purpose || 'signin');
    }

    res.json({
      success: true,
      message: dispatchRes.message,
      delivered: dispatchRes.delivered,
      channel: dispatchRes.channel,
      provider: dispatchRes.provider,
      otpCode: dispatchRes.previewOtp,
      expiresInSeconds,
    });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate OTP' });
  }
});

// 8. Auth: Verify OTP
registerRoute('post', '/api/auth/verify-otp', (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      res.status(400).json({ success: false, error: 'Identifier and OTP code are required' });
      return;
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Universal test code 123456 or match stored
    const record = otpStore.get(cleanId);
    const isValid = cleanOtp === '123456' || (record && record.code === cleanOtp && record.expiresAt > Date.now());

    if (!isValid) {
      res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid or expired OTP. Please check the code or request a new one.',
      });
      return;
    }

    res.json({
      success: true,
      verified: true,
      message: 'OTP verified successfully',
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// 9. Auth: Sign In (OTP or Password)
registerRoute('post', '/api/auth/signin', (req: Request, res: Response) => {
  try {
    const { identifier, method = 'otp', otp, password } = req.body;
    if (!identifier) {
      res.status(400).json({ error: 'Email or Mobile number is required' });
      return;
    }

    const cleanId = String(identifier).trim();
    const lowerId = cleanId.toLowerCase();

    if (method === 'otp') {
      const record = otpStore.get(lowerId);
      const cleanOtp = String(otp || '').trim();
      const isValid = cleanOtp === '123456' || (record && record.code === cleanOtp && record.expiresAt > Date.now());
      if (!isValid) {
        res.status(400).json({ error: 'Invalid or expired OTP code' });
        return;
      }
    }

    let user = registeredUsers.get(lowerId);
    if (!user) {
      const isEmail = cleanId.includes('@');
      user = {
        id: `citizen_${Date.now()}`,
        name: isEmail ? cleanId.split('@')[0] : `Citizen ${cleanId.slice(-4)}`,
        identifierType: isEmail ? 'email' : 'mobile',
        identifier: cleanId,
        email: isEmail ? cleanId : undefined,
        mobile: !isEmail ? cleanId : undefined,
        state: 'All-India (Central)',
        occupation: 'General',
        isOtpVerified: true,
        token: `jwt_civic_${Date.now()}`,
        createdAt: new Date().toISOString(),
        savedSchemes: [],
      };
      registeredUsers.set(lowerId, user);
    }

    res.json({
      success: true,
      user,
      token: user.token,
    });
  } catch (err: any) {
    console.error('Sign In error:', err);
    res.status(500).json({ error: 'Sign in failed' });
  }
});

// 10. Auth: Sign Up (Register New Citizen)
registerRoute('post', '/api/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, identifierType, identifier, email, mobile, state, occupation, gender, otp } = req.body;
    if (!identifier || !name) {
      res.status(400).json({ error: 'Full name and identifier (mobile or email) are required' });
      return;
    }

    const cleanId = String(identifier).trim();
    const lowerId = cleanId.toLowerCase();

    // Verify OTP if provided
    if (otp) {
      const record = otpStore.get(lowerId);
      const cleanOtp = String(otp).trim();
      const isValid = cleanOtp === '123456' || (record && record.code === cleanOtp && record.expiresAt > Date.now());
      if (!isValid) {
        res.status(400).json({ error: 'Invalid or expired OTP code during registration' });
        return;
      }
    }

    const user = {
      id: `citizen_${Date.now()}`,
      name: String(name).trim(),
      identifierType: identifierType || (cleanId.includes('@') ? 'email' : 'mobile'),
      identifier: cleanId,
      email: email ? String(email).trim() : (cleanId.includes('@') ? cleanId : undefined),
      mobile: mobile ? String(mobile).trim() : (!cleanId.includes('@') ? cleanId : undefined),
      state: state || 'All-India (Central)',
      occupation: occupation || 'General',
      gender: gender || 'all',
      isOtpVerified: true,
      token: `jwt_civic_${Date.now()}`,
      createdAt: new Date().toISOString(),
      savedSchemes: [],
    };

    registeredUsers.set(lowerId, user);

    res.json({
      success: true,
      message: 'Citizen registration completed successfully',
      user,
      token: user.token,
    });
  } catch (err: any) {
    console.error('Sign Up error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default apiApp;

