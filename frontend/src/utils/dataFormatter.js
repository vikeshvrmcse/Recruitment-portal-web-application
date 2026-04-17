
  function toDateOnly(dateString) {
    const d = new Date(dateString);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

function reverseTransform(data) {
    return data?.map(item => ({
      id: item.r.id,
      name: item.employee.empName,
      status: item.r.status,
      designation: item.employee.designation,
      department: item.employee.dept,
      deadline: toDateOnly(item.r.deadline),
      createdAt: toDateOnly(item.r.createdAt),
      empID: item.employee.empID,
      reqType: item.r.reqType,
      jobTitle: item.r.jobTitle,
      jobType: item.r.jobType,
      location: item.r.location,
      description: item.r.description,
      requirements: item.r.requirements,
      requisitionReason: item.r.requisitionReason,
      highestQualification: item.r.highestQualification,
      experienceLevel: item.r.experienceLevel,
      yearOfExperience: item.r.yearOfExperience,
      skills: item.r.skills,
      vacancy: item.r.vacancy
    }));
  }

  export {reverseTransform}