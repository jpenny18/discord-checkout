const MetaApi = require('metaapi.cloud-sdk').default;

async function updateAccount() {
  const token = process.env.NEXT_PUBLIC_META_API_TOKEN;
  const api = new MetaApi(token);
  const accountId = process.env.NEXT_PUBLIC_META_API_ACCOUNT_ID;

  try {
    // Get the account
    const account = await api.metatraderAccountApi.getAccount(accountId);
    
    // Update account configuration
    await api.metatraderAccountApi.updateAccount(accountId, {
      name: "Test 1 (JPENNY)",
      type: "cloud-g2",
      login: "42716017",
      server: "AdmiralsGroup-Demo",
      platform: "mt5",
      magic: 0,
      region: "london",
      reliability: "high",
      metastatsApiEnabled: true,  // Enable trading statistics
      riskManagementApiEnabled: true,  // Enable risk management
      accessRights: {
        trading: true,
        history: true,
        positions: true,
        orders: true
      }
    });

    console.log('Account updated successfully');

    // Redeploy the account to apply changes
    await account.undeploy();
    await account.deploy();
    
    // Wait for connection
    await account.waitConnected();
    
    // Verify new configuration
    const updatedAccount = await api.metatraderAccountApi.getAccount(accountId);
    console.log('Updated Account Configuration:', {
      metastatsEnabled: updatedAccount.metastatsApiEnabled,
      riskManagementEnabled: updatedAccount.riskManagementApiEnabled,
      state: updatedAccount.state,
      connectionStatus: updatedAccount.connectionStatus
    });

  } catch (error) {
    console.error('Error updating account:', error);
  }
}

updateAccount(); 