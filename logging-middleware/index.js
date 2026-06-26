let globalToken = null;

export const setLogToken = (token) => {
  globalToken = token;
};

const validStacks = ['frontend', 'backend'];
const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const validFrontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
const validSharedPackages = ['auth', 'config', 'middleware', 'utils'];

export const Log = async (stack, level, pkg, message) => {
  if (!validStacks.includes(stack)) {
    throw new Error(`Invalid stack: ${stack}. Must be frontend or backend.`);
  }
  if (!validLevels.includes(level)) {
    throw new Error(`Invalid level: ${level}.`);
  }
  
  const isFrontendPkg = validFrontendPackages.includes(pkg);
  const isSharedPkg = validSharedPackages.includes(pkg);
  
  if (stack === 'frontend' && !isFrontendPkg && !isSharedPkg) {
      throw new Error(`Invalid package for frontend: ${pkg}`);
  }

  const payload = { stack, level, package: pkg, message };

  if (!globalToken) {
    return;
  }

  try {
    await fetch('http://4.224.186.213/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalToken}`
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Ignore errors silently to prevent app crash since no console.log is allowed
  }
};
