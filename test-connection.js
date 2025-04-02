const MetaApi = require('metaapi.cloud-sdk').default;

async function testConnection() {
  const token = process.env.NEXT_PUBLIC_META_API_TOKEN;
  const api = new MetaApi(token);
  const accountId = process.env.NEXT_PUBLIC_META_API_ACCOUNT_ID;

  try {
    console.log('1. Testing Account Connection...');
    const account = await api.metatraderAccountApi.getAccount(accountId);
    console.log('Account Status:', {
      state: account.state,
      connectionStatus: account.connectionStatus,
      metastatsEnabled: account.metastatsApiEnabled,
      riskManagementEnabled: account.riskManagementApiEnabled
    });

    console.log('\n2. Testing RPC Connection...');
    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();
    console.log('RPC Connection:', {
      connected: connection.connected,
      synchronized: connection.synchronized
    });

    console.log('\n3. Testing Account Information...');
    const accountInfo = await connection.getAccountInformation();
    console.log('Account Info:', accountInfo);

    console.log('\n4. Testing History Orders...');
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2026-01-01');
    const historyOrders = await connection.getHistoryOrdersByTimeRange(startDate, endDate);
    console.log('History Orders:', {
      received: Array.isArray(historyOrders),
      count: Array.isArray(historyOrders) ? historyOrders.length : 0,
      sample: Array.isArray(historyOrders) && historyOrders.length > 0 ? historyOrders[0] : null
    });

    console.log('\n5. Testing Deals...');
    const deals = await connection.getDealsByTimeRange(startDate, endDate);
    console.log('Deals:', {
      received: Array.isArray(deals),
      count: Array.isArray(deals) ? deals.length : 0,
      sample: Array.isArray(deals) && deals.length > 0 ? deals[0] : null
    });

    if (Array.isArray(historyOrders) && Array.isArray(deals)) {
      console.log('\n6. Testing Trade Processing...');
      // Map deals by position ID
      const dealsByPosition = new Map();
      deals.forEach(deal => {
        if (deal.positionId) {
          if (!dealsByPosition.has(deal.positionId)) {
            dealsByPosition.set(deal.positionId, []);
          }
          dealsByPosition.get(deal.positionId).push(deal);
        }
      });

      console.log('Deals Mapping:', {
        totalPositions: dealsByPosition.size,
        samplePosition: dealsByPosition.size > 0 ? {
          positionId: Array.from(dealsByPosition.keys())[0],
          deals: dealsByPosition.get(Array.from(dealsByPosition.keys())[0])
        } : null
      });

      // Process a sample trade
      const sampleOrder = historyOrders[0];
      if (sampleOrder && sampleOrder.positionId) {
        const positionDeals = dealsByPosition.get(sampleOrder.positionId) || [];
        console.log('Sample Trade Processing:', {
          orderId: sampleOrder.id,
          positionId: sampleOrder.positionId,
          orderType: sampleOrder.type,
          dealsFound: positionDeals.length,
          deals: positionDeals
        });
      }
    }

    console.log('\n7. Testing MetaStats API...');
    if (account.metastatsApiEnabled) {
      const metaStats = await api.metastatsApi.getMetrics(accountId, startDate, endDate);
      console.log('MetaStats:', metaStats);
    }

    console.log('\n8. Testing Risk Management API...');
    if (account.riskManagementApiEnabled) {
      const riskManagement = await api.riskManagementApi.getTradingLimits(accountId);
      console.log('Risk Management:', riskManagement);
    }

  } catch (error) {
    console.error('Error during testing:', error);
  }
}

testConnection(); 