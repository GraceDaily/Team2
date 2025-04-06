import React from "react";

const Pagination = ({page, setPage}) => {

  const Previous = () => {
    if (page !== 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const Next = () => {
    if (page < 10) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="my-3 d-flex justify-content-between align-items-center">
        <button
          className="px-3 py-1 m-1 text-center btn-danger"
          onClick={Previous}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 m-1 text-center btn-danger"
          onClick={Next}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;

