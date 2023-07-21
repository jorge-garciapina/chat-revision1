import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "./graphqlQueries/authQueries";

const Users = () => {
  // Execute the query
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Users</h2>
      {data.users.map(({ email, username, password }) => (
        <div key={email}>
          <p>
            {username}
            {email} {password}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Users;
