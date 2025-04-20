export default function formatDate(dateString) {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
  }
  