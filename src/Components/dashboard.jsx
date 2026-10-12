import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
   const token=localStorage.getItem("Token");
   useEffect(()=>{
    if(Token){
      logout();
      return;
    }
    axios.get('http//localhost:8081/verify',{
      headers:{
        Authorization:'Bearer ${token}',
      },
    }).catch((err)=>{
      alert("session logged out please relogin")
      logout();
    })
   },[token])

  async function getAllUsers(currentPage = page) {
    try {
      const response = await axios.get(
        `http://localhost:8081/student/users?page=${currentPage}&size=2`
      );

      setUsers(response.data.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    }

  }

  async function updateUser(user) {
    const name = prompt("Enter Your Updated UserName", user.name);
    const updatedemail = prompt("Enter Your Updated Email", user.email);

    const updatedNewUserDetails = {
      name: name,
      email: updatedemail,
    };

    try {
      await axios.put(
        `http://localhost:8081/student/update/${user.id}`,
        updatedNewUserDetails
      );

      alert("User Updated Successfully");
      getAllUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function deleteUsera(id) {
    const confirmed = window.confirm(
      "Are you Sure You Want To Delete?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8081/student/delete/${id}`
      );

      alert("User Deleted Successfully");
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  function prepage() {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      getAllUsers(newPage);
    }
  }

  function nextpage() {
    const newPage = page + 1;
    setPage(newPage);
    getAllUsers(newPage);
  }

  return (
    <>
      <h1>WELCOME TO DASHBOARD</h1>

      <button onClick={() => getAllUsers()} className="updateB">
        Get User
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <button
                  className="updateB"
                  onClick={() => updateUser(user)}
                >
                  Update
                </button>
              </td>

              <td>
                <button
                  className="deleteB"
                  onClick={() => deleteUsera(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className="pre1" onClick={prepage} disabled={page === 0}>
          Previous
        </button>

        <button className="next2" onClick={nextpage}>
          Next
        </button>
      </div>
    </>
  );
}