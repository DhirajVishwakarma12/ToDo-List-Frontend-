if(!import.meta.env.VITE_API_URL)
{
    console.log("Vite api url not in environment variable")
}

const Config = {
  API_URL: import.meta.env.VITE_API_URL,
};

export default Config;