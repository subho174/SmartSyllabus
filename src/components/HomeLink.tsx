import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const HomeLink = () => {
  return (
    <div className="flex justify-center mt-4">
      <Link
        href="/"
        className="font-semibold flex items-center justify-center gap-2 text-yellow-600"
      >
        <ArrowLeft />
        Back To HomePage
      </Link>
    </div>
  );
};

export default HomeLink;
