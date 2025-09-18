export const formatDate = (date:Date) => {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "long",
    }).format(date);
};
