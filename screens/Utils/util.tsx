export const baseUrl = 'https://studio.juspay.in/turing/';

export const Apis =  {
   MatricApi :`${baseUrl}hyperAssist/ticket/metric/fetch/v2`,
   MultiselectMatricApi :`${baseUrl}hyperAssist/metric/api/fetch/withcategories`,
   AllTicketsApi : `${baseUrl}hyperAssist/issue/simplified/fetch`,
   TicketDetailApi : `${baseUrl}temporary/issue/fetch/s2s`,
   LoginApi : `${baseUrl}hyperAssist/login`,
   ValidTokenApi : `${baseUrl}hyperAssist/validateToken`,
   GetAccessTokenApi : `${baseUrl}hyperAssist/getAccessToken`,
   WorkflowApi : `${baseUrl}workflow/fetch/output/simplified/s2s`,
   AllThreadsApi : `${baseUrl}hyperAssist/getTicketConversions`,
   ThreadsDetailsApi : `${baseUrl}hyperAssist/getThreadData`,
   MerchantFollowUpApi :`${baseUrl}alert/fetch/s2s`,
}
export const actionableEmail = ['deepak.oram@juspay.in','yash.daga@juspay.in','chaitak.gorai@juspay.in','naman.kalkhuria@juspay.in','venkatesan.s@juspay.in']
export const tableEmail = ['deepak.oram@juspay.in','naman.kalkhuria@juspay.in','venkatesan.s@juspay.in','yash.daga@juspay.in']