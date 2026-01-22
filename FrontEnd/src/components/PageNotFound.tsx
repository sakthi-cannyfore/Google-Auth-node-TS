import { Link } from "react-router-dom"
const PageNotFound = () => {
  return (
    <div className="bg-black text-white h-screen flex flex-col justify-center items-center ">
            <h1 className="text-5xl font-bold ">Oops Page Not Fount </h1>
            <Link to={"/"} className="underline my-10">Go Home</Link>

    </div>
  )
}

export default PageNotFound