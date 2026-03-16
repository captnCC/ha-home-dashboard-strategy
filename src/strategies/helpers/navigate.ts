export const navigate = (url: string) => {
  return `${url}?historyBack=1`;
};


export const tapNavigate = function (url: string) {
  return {
    action: "navigate",
    navigation_path: navigate(url),
  };
};