import {
  getCurrentUserFromDb,
  getPaginatedBorrowedGizmos,
  getPaginatedFavoritedGizmos,
  getPaginatedUserGizmos,
} from "../api/dataAccess";
import { useEffect, useState } from "react";
import { getPaginatedGizmosAndLocations } from "../api/dataAccess";
import { GizmoCard } from "./cards/GizmoCard";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

export const GizmoInventory = () => {
  const [gizmos, setGizmos] = useState([]);
  const [filteredGizmos, setFilter] = useState([]);
  const [cuurrentPage, setCurrentPage] = useState();
  const [view, setView] = useState("myGizmos");
  const [pageData, setPageData] = useState({
    currentPageNumber: 1,
    totalGizmos: 0,
    gizmoRangeStart: 1,
    gizmoRangeEnd: 0,
  });

  const queryClient = useQueryClient();

  const currentUser = useQuery("currentUser", getCurrentUserFromDb, {
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    document.title = "Gizmo Garage";
  }, []);

  const navigate = useNavigate();
  //do I want to paginate data? Yesm probably. Otherwise the fetch call will return too much info.
  //Option 1: paginate data
  //option 2: Only have filtered data
  //Option 3: use an accordian
  //Option 4: click on a filter or selection and only see the returned values. the page is blank to begin with and you have to populate it with the data you want.
  //Option 5: infitine scroll.
  const fetchUserGizmos = async (page, onMount) => {
    const { data, totalCount } = await getPaginatedUserGizmos(
      page,
      "id",
      20,
      currentUser.data.id
    );
    const totalPages = Math.ceil(totalCount / 20);
    let gizmoRangeEnd;
    if (totalCount < 20) {
      gizmoRangeEnd = totalCount;
    } else {
      gizmoRangeEnd = 20;
    }
    setGizmos(data);
    if (onMount) {
      setPageData({
        currentPageNumber: 1,
        totalGizmos: totalCount,
        gizmoRangeStart: 1,
        gizmoRangeEnd: gizmoRangeEnd,
      });
    }
  };

  const fetchBorrowedGizmos = async (page, onMount) => {
    const { data, totalCount } = await getPaginatedBorrowedGizmos(
      page,
      "id",
      20,
      currentUser.data.id
    );
    const totalPages = Math.ceil(totalCount / 20);
    let gizmoRangeEnd;
    if (totalCount < 20) {
      gizmoRangeEnd = totalCount;
    } else {
      gizmoRangeEnd = 20;
    }
    setGizmos(data);
    if (onMount) {
      setPageData({
        currentPageNumber: 1,
        totalGizmos: totalCount,
        gizmoRangeStart: 1,
        gizmoRangeEnd: gizmoRangeEnd,
      });
    }
  };

  const fetchFavoritedGizmos = async (page, onMount) => {
    const { data, totalCount } = await getPaginatedFavoritedGizmos(
      page,
      "id",
      20,
      currentUser.data.id
    );
    const totalPages = Math.ceil(totalCount / 20);
    let gizmoRangeEnd;
    if (totalCount < 20) {
      gizmoRangeEnd = totalCount;
    } else {
      gizmoRangeEnd = 20;
    }
    setGizmos(data);
    if (onMount) {
      setPageData({
        currentPageNumber: 1,
        totalGizmos: totalCount,
        gizmoRangeStart: 1,
        gizmoRangeEnd: gizmoRangeEnd,
      });
    }
  };
  useEffect(() => {
    fetchUserGizmos(1, true);
  }, []);

  useEffect(() => {
    switch (view) {
      case "myGizmos":
        fetchUserGizmos(1, true);
        break;
      case "borrowedGizmos":
        fetchBorrowedGizmos(1, true);
        break;
      case "savedGizmos":
        fetchFavoritedGizmos(1, true);
        break;
    }
  }, [view]);

  const incrementPage = (e) => {
    e.preventDefault();

    //optimistically increase current page number by 1
    const pageDataCopy = { ...pageData };
    pageDataCopy.currentPageNumber += 1;

    // start/end ranges of page values
    pageDataCopy.gizmoRangeStart =
      (pageDataCopy.currentPageNumber - 1) * 20 + 1;
    if (pageDataCopy.totalGizmos < pageDataCopy.currentPageNumber * 20) {
      pageDataCopy.gizmoRangeEnd = pageDataCopy.totalGizmos;
    } else {
      pageDataCopy.gizmoRangeEnd = pageDataCopy.currentPageNumber - 1 * 20;
    }

    //fetch data based on new current page values

    switch (view) {
      case "myGizmos":
        fetchUserGizmos(pageDataCopy.currentPageNumber);
        break;
      case "borrowedGizmos":
        fetchBorrowedGizmos(pageDataCopy.currentPageNumber);
        break;
      case "savedGizmos":
        fetchFavoritedGizmos(pageDataCopy.currentPageNumber);
        break;
    }
    setPageData(pageDataCopy);
  };

  const decrementPage = (e) => {
    e.preventDefault();

    //optimistically increase current page number by 1
    const pageDataCopy = { ...pageData };
    pageDataCopy.currentPageNumber -= 1;

    // start/end ranges of page values

    pageDataCopy.gizmoRangeStart =
      (pageDataCopy.currentPageNumber - 1) * 20 + 1;
    if (pageDataCopy.totalGizmos < pageDataCopy.currentPageNumber * 20) {
      pageDataCopy.gizmoRangeEnd = pageDataCopy.totalGizmos;
    } else if (pageDataCopy.currentPageNumber === 1) {
      pageDataCopy.gizmoRangeEnd = 20;
    } else {
      pageDataCopy.gizmoRangeEnd = pageDataCopy.currentPageNumber - 1 * 20;
    }
    //fetch data based on new current page values
    switch (view) {
      case "myGizmos":
        fetchUserGizmos(pageDataCopy.currentPageNumber);
        break;
      case "borrowedGizmos":
        fetchBorrowedGizmos(pageDataCopy.currentPageNumber);
        break;
      case "savedGizmos":
        fetchFavoritedGizmos(pageDataCopy.currentPageNumber);
        break;
    }
    setPageData(pageDataCopy);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between max-w-xl md:max-w-screen-xl mx-auto items-center">
        <h1 className="ml-4 dark:text-white max-w-xl md:max-w-screen-xl mb-6">
          Gizmo Garage
        </h1>
        <button
          onClick={(click) => {
            click.preventDefault();
            navigate("/add-gizmo");
          }}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 mr-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add A Gizmo
        </button>
      </div>

      <div className="text-sm font-medium text-center mb-6 text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mx-auto max-w-xl md:max-w-screen-xl">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => {
                setView("myGizmos");
              }}
              className={`inline-block p-4 rounded-t-lg  border-b-2 ${
                view === "myGizmos"
                  ? "text-blue-600  border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } `}
              aria-current="page"
            >
              My Gizmos
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => {
                setView("borrowedGizmos");
              }}
              className={`inline-block p-4 rounded-t-lg  border-b-2 ${
                view === "borrowedGizmos"
                  ? "text-blue-600  border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } `}
            >
              Borrowed Gizmos
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => {
                setView("savedGizmos");
              }}
              className={`inline-block p-4 rounded-t-lg  border-b-2 ${
                view === "savedGizmos"
                  ? "text-blue-600  border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              } `}
            >
              Saved Gizmos
            </button>
          </li>
        </ul>
      </div>
      <div className="flex gap-y-5 justify-center flex-wrap p-2 gap-x-6 mx-auto max-w-xl md:  md:max-w-screen-xl  ">
        {gizmos.map((gizmo) => (
          <GizmoCard
            key={`gizmo--${gizmo.id}`}
            img={gizmo.img}
            id={gizmo.id}
            name={gizmo.nickName}
            model={gizmo.model}
            location={
              gizmo.gizmoRentals?.length
                ? `${gizmo.gizmoRentals[0].user.firstName}'s`
                : "Home"
            }
            userImg={gizmo.user?.profileImg}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pageData.gizmoRangeStart}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pageData.gizmoRangeEnd}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pageData.totalGizmos}
          </span>{" "}
          Entries
        </span>

        <div className="inline-flex mt-2 xs:mt-0">
          {pageData.gizmoRangeStart === 1 ? (
            <button
              disabled
              onClick={(click) => decrementPage(click)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 "
            >
              {" "}
              Prev
            </button>
          ) : (
            <button
              onClick={(click) => decrementPage(click)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {" "}
              Prev
            </button>
          )}
          {pageData.gizmoRangeEnd === pageData.totalGizmos ? (
            <button
              disabled
              onClick={(click) => incrementPage(click)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 "
            >
              Next
            </button>
          ) : (
            <button
              onClick={(click) => incrementPage(click)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};
