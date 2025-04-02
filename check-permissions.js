const MetaApi = require('metaapi.cloud-sdk').default;

async function checkPermissions() {
  const token = process.env.NEXT_PUBLIC_META_API_TOKEN;
  const api = new MetaApi(token);

  try {
    // Check token info
    const tokenInfo = await api.tokenManagementApi.getTokenInfo();
    console.log('Token Permissions:', {
      applications: tokenInfo.applications,
      roles: tokenInfo.roles,
      resources: tokenInfo.resources,
      expiresIn: tokenInfo.expiresIn,
      issuedAt: tokenInfo.issuedAt
    });

    // Check account access
    const accounts = await api.metatraderAccountApi.getAccounts();
    console.log('Accessible Accounts:', accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      state: acc.state,
      permissions: acc._data.permissions
    })));

  } catch (error) {
    console.error('Error checking permissions:', error);
  }
}

checkPermissions(); 