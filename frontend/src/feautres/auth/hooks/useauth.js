import { useContext ,useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getme } from "../services/auth.api.js";

export const useAuth = () => {
   const context = useContext(AuthContext);

   const { user, setuser, loading, setloading } = context;

   const handlelogin = async ({ email, password }) => {
      setloading(true);
      try {
         const data = await login({ email, password });

         if (data?.user) {
            setuser(data.user);
         }

         return data;
      } catch (err) {
         console.error(err);
         return null;
      } finally {
         setloading(false);
      }
   };

   const handleregister = async ({ username, email, password }) => {
      setloading(true);

      try {
         const data = await register({ username, email, password });

         if (data?.user) {
            setuser(data.user);
         }

         return data;
      } catch (e) {
         console.error(e);
         return null;
      } finally {
         setloading(false);
      }
   };

   const handlelogout = async () => {
      setloading(true);
      try{

      
      await logout();
      setuser(null);
      }catch(e){
         console.log(e)
      }finally{

      setloading(false);}
   };
   useEffect(() => {
      const getAndSet = async () => {
         try {
            const data = await getme();
            if (data?.user) {
               setuser(data.user);
            }
         } catch (err) {
            console.error(err);
         } finally {
            setloading(false);
         }
      };

      getAndSet();
   }, [setuser, setloading]);


   return { user, loading, handleregister, handlelogin, handlelogout };
};