import { useState } from "react";
import { useQueryClient } from "react-query";
import { deleteGizmoRental } from "../../api/dataAccess";
import { EditRequestModal } from "../modals/EditRequestModal";

export const LoanCard = ({
  rentalId,
  startDate,
  endDate,
  rentalMsg,
  gizmo,
  user,
  img,
  variant,
  rentalGizmoId,
  rentalObj,
  renter,
  owner,
}) => {
  const [modalIsActive, setModalIsActive] = useState(false);

  const queryClient = useQueryClient();

  const handleCancelLoan = async (e) => {
    e.preventDefault();

    const deleteResponse = await deleteGizmoRental(rentalId);
    queryClient.invalidateQueries(["pendingUserGizmoRequests"]);
    queryClient.invalidateQueries(["pendingGizmoUserRequests"]);
    queryClient.invalidateQueries(["approvedUpcomingUserLoans"]);
    queryClient.invalidateQueries(["approvedOngoingUserLoans"]);
    setModalIsActive(true);
  };

  const getDateString = (date) => {
    const initialDate = new Date(date);
    const updatedDate = new Date(
      initialDate.setDate(initialDate.getDate() + 1)
    );
    const dateString = updatedDate.toLocaleDateString("en-US");
    return dateString;
  };

  return (
    <>
      <div className="flex flex-col  border border-gray-200 rounded-lg shadow-md md:flex-row md:w-full dark:border-gray-700 dark:bg-gray-800">
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          src={img}
          alt=""
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <div className="flex flex-col md:flex-row items-baseline gap-4">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {user} {gizmo}
            </h5>
            <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-400">
              Rental Period: {getDateString(startDate)} -{" "}
              {getDateString(endDate)}
            </p>
          </div>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {renter} agreed to share {owner} {gizmo}
          </p>
          <div className="flex gap-6 md:flex-row ">
            {variant === "upcomingLoan" ? (
              <>
                <button
                  type="submit"
                  onClick={(click) => {
                    handleCancelLoan(click);
                  }}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-40 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cancel Loan
                </button>
              </>
            ) : variant === "ongoing-provider" ? (
              <>
                <button
                  type="submit"
                  onClick={(click) => {
                    // handleApprove(click);
                  }}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-40 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Mark as Returned
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <EditRequestModal
        isActive={modalIsActive}
        setModalIsActive={setModalIsActive}
        rentalId={rentalId}
        rentalGizmoId={rentalGizmoId}
      />
    </>
  );
};
