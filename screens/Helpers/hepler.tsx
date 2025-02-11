export const getDates = (startDate?: string, endDate?: string) => {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}Z`;
  
    if (startDate && endDate) {
      return {
        startDate: `${startDate}T18:30:00Z`,
        endDate: `${endDate}T${timeString}`,
      };
    }
  
    const today = now.toISOString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const dayBeforeYesterday = new Date(now);
    dayBeforeYesterday.setDate(now.getDate() - 1);
    return {
      presentDate: today.split('T')[0] + 'T' + '18:30:00Z',
      lastTwoDates: dayBeforeYesterday.toISOString().split('T')[0] + 'T' + '18:30:00Z',
    };
  };

  export const  formatDate = (dateString: any)=> {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const isPM = hours >= 12;
    const formattedHours = (hours % 12) || 12; // Convert to 12-hour format
    const ampm = isPM ? "PM" : "AM";

    return `${day} ${month}, ${formattedHours}:${minutes} ${ampm}`;
  }
  
  type Ticket = {
    id: string;
    incidence: string | null;
    query_type: string;
    reported_date: string;
    subject: string;
    ticket_id: string;
    ticket_number: string;
    ticket_status: string;
    verified: boolean;
};

export const sortTicketsByDate = (tickets: Ticket[]): Ticket[]=> {
    return tickets.sort((a, b) => new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime());
}

export const isJuspayDomain = (email: string): boolean=> {
  // Extract the domain part of the email
  const domain = email.split("@")[1];

  // Check if the domain matches 'juspay.in'
  return domain === "juspay.in";
}
export const statusColor = (status:any)=>{
  switch (status) {
    case 'OPEN':
      return '#FDE9CE'
    case 'Closed':
      return '#c5fce2'
    case 'PENDING INTERNALLY':
      return '#e87d7d'
    case 'On Hold':
      return '#d9d4d4'
    case 'RESOLVED':
      return '#c5fce2'
    case 'DEBUGGING':
      return '#b59f9f'
    case 'In Progress':
      return '#d9d4d4'
    default:
      return '#fff'
  }
}

export const tableDataConverter = (e:any)=>{
  return (e?.map((item:any)=>{
    return {label:item, value:item} 
   }))
}
export const getPreviousDate = (dateString:any) => {
  // Parse the input date string into a Date object
  const currentDate = new Date(dateString);

  // Subtract one day (24 hours) from the current date
  currentDate.setDate(currentDate.getDate() - 1);

  // Return the previous date in ISO format (or any desired format)
  return currentDate.toISOString(); // Formats as "YYYY-MM-DD"
};

export const convertUTCtoIST = (utcDateString:any) => {
  // Parse the UTC date string into a Date object
  const utcDate = new Date(utcDateString);

  // Add 5 hours and 30 minutes to convert to IST (UTC +5:30)
  utcDate.setHours(utcDate.getHours() + 5);
  utcDate.setMinutes(utcDate.getMinutes() + 30);

  // Return the IST date in ISO format
  return utcDate.toISOString(); // The result will be in UTC, but reflecting the IST time
};
 
export const subtractOneMinute = (dateString:any) => {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Subtract 1 minute
  date.setMinutes(date.getMinutes() - 1);

  // Return the updated date in ISO format (or any desired format)
  return date.toISOString(); // You can format as needed
};

export const  filterTickets = (x:any, invalidTicket:any)=> {
  return invalidTicket.filter((ticket:any) => !x.includes(ticket.ticket_id));

}

export const isDatePastNthDay = (dateObj:any, n:any)=> {
  const givenDate:any = new Date(dateObj.endDate);
  const nDaysInMs = n * 24 * 60 * 60 * 1000; // Milliseconds in n days
  const currentDate:any = new Date();

  // Calculate the difference between the current date and the given date
  const timeDifference = currentDate - givenDate;

  // Check if the difference is more than n days
  return timeDifference > nDaysInMs;
}

export const secondsToHours = (seconds:any, decimalPlaces = 1)=> {
  const hours = seconds / 3600;
  return hours.toFixed(decimalPlaces);
}

export const processResponse = (response: any,tabIndex:any) => {
  // Define the keys to extract
  
  const keysToExtract = [
    tabIndex === "ASSIGNEE" ? "assignee" : tabIndex === "PRODUCT" ? 'query_type' : 'merchant_id',
    "ticket_level_stats.legit_tickets",
    "ticket_level_stats.juspay_resp_pending_count",
    "ticket_level_stats.response_rate_within_threshold",
    "ticket_level_stats.active_count",
    "ticket_level_stats.resolution_rate_without_upstream_dependency",
    "ticket_level_stats.closure_rate_within_threshold",
    "thread_level_stats.tp99",
    "ticket_level_stats.juspay_issue_rate",
  ];

  // Helper function to extract nested keys
  function extractValue(obj: any, keyPath: string): any {
    return keyPath.split('.').reduce((acc, key) => acc && acc[key], obj) || null;
  }

  // Customization logic for specific keys
  function customizeValue(key: string, value: any): any {
    switch (key) {
      case "assignee":
        // Break the email into multiple lines
        return value && value;
      case "ticket_level_stats.response_rate_within_threshold":
        // Break the email into multiple lines
        return value && `${parseFloat(value).toFixed(1)}`;
      case "ticket_level_stats.resolution_rate_without_upstream_dependency":
        // Break the email into multiple lines
        return value && `${parseFloat(value).toFixed(1)}`;
      case "ticket_level_stats.closure_rate_within_threshold":
        // Break the email into multiple lines
        return value && `${parseFloat(value).toFixed(1)}`;
      case "thread_level_stats.tp99":
        // Convert seconds to a human-readable format (e.g., HH:mm:ss)
        return value && secondsToHours(value || 0);
      case "ticket_level_stats.juspay_issue_rate":
        // Add a percentage sign to the issue rate
        return value !== null ? `${parseFloat(value).toFixed(1)}` : value;
      case "ticket_level_stats.legit_tickets":
        // Add a percentage sign to the issue rate
        return value  && value.length;
      case "ticket_level_stats.juspay_resp_pending_count":
        // Add a percentage sign to the issue rate
        return value  && value;
      default:
        return value;
    }
  }

  // Map the response to the desired format with customizations
  let tableResponse = response?.map((item:any) =>
    keysToExtract?.map((key) => {
      const rawValue = extractValue(item, key);
      return customizeValue(key, rawValue);
    })
  );
  // let x = tableResponse[0]?.map((item)=>{item})
  // console.log(x,'y');
  
  return tableResponse
};


export const sortData = (data: any, columnIndex: any, { direction = "asc" }) => {
  return [...data].sort((a, b) => {
    const aValue = a[columnIndex];
    const bValue = b[columnIndex];

    // Convert strings to numbers if they represent floats or integers
    const parsedA = parseFloat(aValue);
    const parsedB = parseFloat(bValue);

    const isANumber = !isNaN(parsedA);
    const isBNumber = !isNaN(parsedB);

    if (isANumber && isBNumber) {
      // Numeric sorting
      return direction === "asc" ? parsedA - parsedB : parsedB - parsedA;
    }

    // If both values are strings (alphabetic sorting)
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue) // Ascending order
        : bValue.localeCompare(aValue); // Descending order
    }

    // Handle null values (place them at the beginning or end based on direction)
    if (aValue === null) return direction === "asc" ? -1 : 1;
    if (bValue === null) return direction === "asc" ? 1 : -1;

    return 0; // If values are of different types or cannot be compared, leave them unchanged
  });
};


export const truncateString = (str: string): string => {
  if (str.length > 300) {
    return str.slice(0, 300) + '...';
  }
  return str;
};


export const apiFetch = async ({
  url,
  method = 'GET',
  body = null,
  headers = {},
  setIsLoading
}: {
  url: string;
  method?: string;
  body?: any;
  headers?: any;
  setIsLoading?:any;
}) => {
  setIsLoading(true)
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    setIsLoading(false)
    return await response.json();
  } catch (error: any) {
    setIsLoading(false)
    console.error('Error occurred in API fetch:', error.message);
    // throw error;
    window.myGlobalFunction?.();
    return null;
  }
};

export function containsHtmlTable(content: string): boolean {  
  if (!content || typeof content !== 'string') {
      throw new Error('Invalid input: content must be a non-empty string.');
  }

  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/i;
  return tableRegex.test(content);
}

export function formatHTMLWithNewlines(html:string) {
  return html
    .replaceAll("Attribution:", '<br><br><strong>Attribution:</strong>')
    .replaceAll("Suggestion:", '<br><br><strong>Suggestion:</strong>')
    .replaceAll("Attribution Tag:", '<br><br><strong>Attribution Tag:</strong>')
    .replaceAll("Attribution tag:", '<br><br><strong>Attribution Tag:</strong>');
}