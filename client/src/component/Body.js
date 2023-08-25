import Tours from "./Tours"
import useTours from "../utils/useTour";
import Simmer from "./Simmer";

const Body = () =>{
    const { tours } = useTours();

    return tours?.length === 0 ? <Simmer /> : (
       <>
      <div className="grid grid-cols-5 gap-2 m-2 items-stretch">
         {
            tours?.map( ele => 
               <div key={ele.id}>
                 <Tours tourData={ele}/>
               </div>
                )
           }
         </div>
       </>
    )
}

export default Body