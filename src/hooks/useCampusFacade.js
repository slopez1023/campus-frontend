export const useCampusFacade = () => {
  const { emit, subscribe } = useCampusEvents();
  
  const [facade] = useState(() => {
    const apiService = {
      get: (url) => fetch(`http://localhost:8080/api${url}`),
      post: (url, data) => fetch(`http://localhost:8080/api${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
      put: (url, data) => fetch(`http://localhost:8080/api${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    };

    const validationService = new ValidationService();
    const eventService = { emit, subscribe };

    return new CampusFacade(apiService, validationService, eventService);
  });

  return facade;
};