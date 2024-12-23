"use client"
import Header from "../components/Header"
import DefaultLayout from "../components/DefaultLayout"
import ProtectedRoute from "../components/ProtectedRoute";
export default function Chat() {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Header></Header>
      </DefaultLayout>
    </ProtectedRoute>
  );
}

