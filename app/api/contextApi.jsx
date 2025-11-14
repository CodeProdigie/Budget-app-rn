import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const ContextApi = createContext();  

export const ContextProvider = ({ children }) => {
  const [summarydata, setSummarydata] = useState([]); 
  const [loading, setLoading] = useState(true);

//   const Api_url = "http://192.168.237.140:5100";

  const Api_url = "http://192.168.188.21:5100" 
// when connected via hotspot-wifi; 

  const summary = async (userId) => {
    try {
      setLoading(true);
      const fetchSummary = await fetch(`${Api_url}/wallet/${userId}`);
      if (!fetchSummary.ok) {
        throw new Error(`HTTP error! status: ${fetchSummary.status}`);
      }
      const result = await fetchSummary.json();
      //   console.log("API Response:", result);
      setSummarydata(result);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummarydata([]);
    } finally {
      setLoading(false);
    }
  };

//   create Transaction

const createTrans = async (userId, title, amount, category) => {
  try {
    const res = await fetch(`${Api_url}/wallet/create-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ user_id: userId, title, amount, category }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const resResult = await res.json();
    console.log("Transaction created:", resResult);
    
    // Refresh summary data
    await summary(userId);
    
    return resResult;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error; // Re-throw so the UI can handle it
  }
};

  const delSummary = async (userId, id) => {
    await fetch(`${Api_url}/wallet/${userId}/${id}`, {
      method: "delete",
    });
    await summary(userId);
  };

  return (
    <ContextApi.Provider value={{ summary, summarydata, loading, delSummary, createTrans }}>
      {children}
    </ContextApi.Provider>
  );
};

export const useContextApi = () => useContext(ContextApi);
