"use client";

import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderHeader = () => (
    <div className="flex items-center justify-between pl-2 w-full mb-5">
      <button
        className="cursor-pointer"
        onClick={() =>
          setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
          )
        }
      >
        <IoIosArrowBack size={16}/>
      </button>
      <h2 className="">{format(currentDate, "MMMM yyyy")}</h2>
      <button
        className="cursor-pointer"
        onClick={() =>
          setCurrentDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
          )
        }
      >
        <IoIosArrowForward size={16}/>
      </button>
    </div>
  );

  const renderDays = () => {
    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

    return (
      <div className="grid grid-cols-7 text-center mb-3 w-full uppercase text-sm text-[#828282] font-bold gap-8 ml-3">
        {weekDays.map((day, i) => (
          <div key={i} className="">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toISOString()}
            className={`
              flex flex-col items-center justify-center w-11 p-2 h-8 text-
              ${!isCurrentMonth ? "text-gray-400" : ""}
             
            `}
          >
            <div className={`${isToday &&"bg-[#f5dff0]  w-6 h-7 flex justify-center items-center rounded-full "}`}>{format(day, "d")}</div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 w-full gap-8">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="flex flex-col gap-1">{rows}</div>;
  };

  return (
    <div className="flex h-full justify-center">
    <div className="w-12/12 h-10/12 flex flex-col items-center justify-center text-black ">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
    </div>
  );
};

export default Calendar;
