export const getDate = (posted_at) => {
    const date = new Date(posted_at);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};