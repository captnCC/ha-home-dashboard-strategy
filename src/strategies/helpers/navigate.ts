export const navigate = (url: string): string => `${url}?historyBack=1`;

export const tapNavigate = (url: string): object => ({
  action: "navigate",
  navigation_path: navigate(url),
});
