// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, saveUser } = useContext(AuthContext);
  const [therapists, setTherapists] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1) Always fetch approved therapists
  useEffect(() => {
    setError("");
    setLoading(true);

    API.get("/therapists", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setTherapists(res.data.therapists))
      .catch((err) => {
        console.error("Fetch therapists error:", err.response || err);
        setError(err.response?.data?.message || "Unable to load therapists");
      })
      .finally(() => setLoading(false));
  }, [user.token]);

  // 2) Assign a therapist
  const chooseTherapist = async (therapistId) => {
    setError("");
    try {
      const response = await API.put(
        "/users/me/therapist",
        { therapistId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedUser = response.data.user;

      // Update context with new therapist field
      saveUser({
        token: user.token,
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        therapist: updatedUser.therapist,
      });

      // Go to the chat screen
      // navigate(`chat/${therapistId}`, { replace: true });
      navigate("/dashboard/therapists", { replace: true });
    } catch (err) {
      console.error("Assign therapist error:", err.response || err);
      setError(err.response?.data?.message || "Could not assign therapist");
    }
  };

  // 3) If already chosen, show only that therapist
  // if (user.therapist) {
  //   const chosen = therapists.find((t) => t._id === user.therapist);
  //   return (
  //     <div className="p-6 space-y-8">
  //       <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
  //       <section>
  //         <h2 className="text-2xl font-semibold mb-4">Your Therapist</h2>
  //         {chosen ? (
  //           <div className="max-w-md mx-auto border rounded-lg p-4 bg-white shadow">
  //             <h3 className="text-xl font-semibold mb-2">{chosen.name}</h3>
  //             {chosen.specialties?.length > 0 && (
  //               <p className="text-sm mb-1">
  //                 <span className="font-medium">Specialties:</span>{" "}
  //                 {chosen.specialties.join(", ")}
  //               </p>
  //             )}
  //             {chosen.degree && chosen.institution && (
  //               <p className="text-sm mb-4">
  //                 <span className="font-medium">Qualification:</span>{" "}
  //                 {chosen.degree}, {chosen.institution}
  //               </p>
  //             )}
  //             <button
  //               className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
  //               onClick={() => navigate(`chat/${chosen._id}`)}
  //             >
  //               Chat Now
  //             </button>
  //           </div>
  //         ) : (
  //           <p>Loading your therapist’s info…</p>
  //         )}
  //       </section>
  //     </div>
  //   );
  // }

  // 4) Otherwise, render the “pick your therapist” grid
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Choose a Therapist to Talk With
        </h2>

        {loading && <p>Loading therapists…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && therapists.length === 0 && (
          <p>No therapists are available at the moment.</p>
        )}

        {!loading && !error && therapists.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {therapists.map((t) => {
              const initial = t.name.charAt(0).toUpperCase();
              return (
                <div
                  key={t._id}
                  className="border rounded-lg p-4 bg-white shadow flex flex-col items-center"
                >
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-semibold mb-3">
                    {initial}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-semibold mb-2">{t.name}</h3>

                  {/* Specialties */}
                  {t.specialties?.length > 0 && (
                    <p className="text-sm mb-1 text-center">
                      <span className="font-medium">Specialties:</span>{" "}
                      {t.specialties.join(", ")}
                    </p>
                  )}

                  {/* Qualification */}
                  {t.degree && t.institution && (
                    <p className="text-sm mb-4 text-center">
                      <span className="font-medium">Qualification:</span>{" "}
                      {t.degree}, {t.institution}
                    </p>
                  )}

                  {/* Choose button */}
                  <button
                    className="mt-auto w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    onClick={() => chooseTherapist(t._id)}
                  >
                    Choose
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
