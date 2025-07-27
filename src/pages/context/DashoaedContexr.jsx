import React, { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [totalCourses, setTotalCourses] = useState("");

  return (
    <CourseContext.Provider value={{ totalCourses, setTotalCourses }}>
      {children}
    </CourseContext.Provider>
  );
};