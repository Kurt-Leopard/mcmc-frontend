export const getDate = (posted_at) => {
    const date = new Date(posted_at);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};


export const getDateTime = (posted_at) => {
    if (!posted_at) return "";
  
    const date = new Date(posted_at);
  
    // Define options for date and time formatting
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format (AM/PM)
    };
  
    return date.toLocaleString("en-US", options);
  };
  