module.exports.day = function () {
  const today = new Date();
  const dateOptions = {
    weekday: "long",
  };
  const day = today.toLocaleString("en-IN", dateOptions);
  return day;
};

exports.date = () => {
  const today = new Date();
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleString("en-IN", dateOptions);
};

// module.exports.day = getDay;
// module.exports.date = getDate;

// function getDay() {
//   let today = new Date();
//   let dateOptions = {
//     weekday: "long",
//   };
//   let day = today.toLocaleString("en-IN", dateOptions);
//   return day;
// }

// function getDate() {
//   const today = new Date();
//   const dateOptions = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   };

//   return today.toLocaleString("en-IN", dateOptions);
// }
