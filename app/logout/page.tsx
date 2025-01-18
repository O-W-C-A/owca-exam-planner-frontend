"use client";

import { useState } from "react";
import Logout from "../components/logout";

export default function LogOut() {
  const [showPopup, setShowPopup] = useState(true);

  return <Logout showPopup={showPopup} onClose={() => setShowPopup(false)} />;
}
