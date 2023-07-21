import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { validateSearchInput } from "./frontendValidation";
import { GET_USER_INFO, SEARCH_USER } from "./graphqlQueries/userQueries";

function Dashboard() {
  const { loading, error, data } = useQuery(GET_USER_INFO);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchErrors, setSearchErrors] = useState({});
  const [searchMessage, setSearchMessage] = useState("");

  const [searchUser, { data: searchResult, error: searchError }] =
    useLazyQuery(SEARCH_USER);

  const handleSearch = (event) => {
    event.preventDefault();

    setSearchMessage("");

    const validationErrors = validateSearchInput(searchTerm);
    if (Object.keys(validationErrors).length > 0) {
      setSearchErrors(validationErrors);
      return;
    }

    searchUser({ variables: { searchTerm } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Welcome, {data.userInfo.username}!</h1>
      <h2>Your Contacts:</h2>
      <ul>
        {data.userInfo.contactList.map((contact, index) => (
          <li key={index}>{contact}</li>
        ))}
      </ul>
      <img src={data.userInfo.avatar} alt={data.userInfo.avatar} />
      <form onSubmit={handleSearch}>
        <div
          className={`input-group ${searchErrors.searchInput ? "error" : ""}`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchErrors({});
            }}
          />
          {searchErrors.searchInput && (
            <span className="error-message">{searchErrors.searchInput}</span>
          )}
        </div>
        <input type="submit" value="Search" />
      </form>
      {searchError && <p>Error: {searchError.message}</p>}
      {searchMessage && <div>{searchMessage}</div>}
      {searchResult && searchResult.searchUser && (
        <div>
          <img
            src={searchResult.searchUser.avatar}
            alt={searchResult.searchUser.username + "'s avatar"}
          />
          <div>{searchResult.searchUser.username}</div>
          <button>Send Request</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

