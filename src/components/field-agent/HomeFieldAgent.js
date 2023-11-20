import { Link } from "react-router-dom"
import { Fragment, useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from "../AlertModal"
import Spinner from "../Spinner"

function HomeFieldAgent() {
    const navigate = useNavigate()
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [numberOfPropertiesAdded, setNumberOfPropertiesAdded] = useState(0)
    const [numberOfPropertyDealersAdded, setNumberOfPropertyDealersAdded] = useState(0)

    const [requestsDropdown, setRequestsDropdown] = useState(false)

    const [spinner, setSpinner] = useState(true)

    const fetchPropertiesAndPropertyDealersAddedByFieldAgent = useCallback(async () => {
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/numberOfPropertyDealersAndPropertiesAddedByFieldAgent`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setSpinner(false)
                setNumberOfPropertyDealersAdded(data.propertyDealersAddedByFieldAgent)
                setNumberOfPropertiesAdded(data.propertiesAddedByfieldAgent)
                return
            } else if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                setAlert({
                    isAlertModal: true,
                    alertType: 'warning',
                    alertMessage: 'Session expired. Please login again',
                    routeTo: '/field-agent/signIn'
                })
            }
        } catch (error) {
            localStorage.removeItem("homestead-field-agent-authToken")
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured. Please login again',
                routeTo: '/field-agent/signIn'
            })
            setSpinner(false)
        }
    }, [authToken])

    useEffect(() => {
        fetchPropertiesAndPropertyDealersAddedByFieldAgent()
    }, [fetchPropertiesAndPropertyDealersAddedByFieldAgent])


    return (
        <Fragment>
            {spinner && <Spinner />}


            {alert.isAlertModal && !spinner && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}


            {!spinner && !alert.isAlertModal &&
                <div className='relative flex flex-col md:flex-row pt-32 md:pt-20 pb-4 pl-2 sm:pl-6 md:pl-8 lg:pl-28 pr-2 sm:pr-6 md:pr-8 lg:pr-28 gap-4 bg-slate-100 min-h-screen ' onClick={() => {
                    setRequestsDropdown(false)
                }}>

                    <div className="hidden md:flex flex-col w-96 h-fit bg-white gap-2 p-3 rounded-lg">
                        <p className="text-2xl font-bold text-center mb-2">Pending Requests</p>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg  hover:bg-sky-100">
                            <p className="text-5xl">0</p>
                            <p className="w-40">Pending visits to add a new property</p>
                        </div>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg hover:bg-sky-100">
                            <p className="text-5xl">0</p>
                            <p className="w-40">Pending visits to add a property dealer</p>
                        </div>
                        <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg hover:bg-sky-100">
                            <p className="text-5xl">0</p>
                            <p className="w-40">Pending requests to reconsider to details of a property</p>
                        </div>
                    </div>

                    <div className={`fixed md:hidden top-16 w-full z-10 ${requestsDropdown ? 'h-screen' : 'h-fit'}`}>
                        <div className="relative mt-3.5 border border-gray-400 w-fit p-1 cursor-pointer bg-white" onClick={e => {
                            e.stopPropagation()
                            setRequestsDropdown(requestsDropdown => !requestsDropdown)
                        }
                        }>Pending Requests {requestsDropdown ? "▲" : "▼"}
                            {requestsDropdown && <div className="absolute top-8 -left-0.5 bg-white" >
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100" >
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending visits to add a new property</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100" >
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending visits to add a new property dealer</p>
                                </div>
                                <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer hover:bg-sky-100">
                                    <p className="text-5xl">0</p>
                                    <p className="w-40">Pending requests to reconsider details of a property</p>
                                </div>
                            </div>}
                        </div>
                    </div>


                    <div className={`w-full bg-white rounded-lg pt-6 pb-6 ${requestsDropdown || alert.isAlertModal ? 'blur' : ''}`} >
                        <div className="flex flex-row gap-3 w-full place-content-center">
                            <button className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 h-8 w-fit" onClick={e => {
                                e.stopPropagation()
                                navigate('/field-agent/add-property')
                            }}>Add Property</button>
                            <Link to='/field-agent/add-property-dealer' className="bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-1 h-8 w-fit" >Add Property Dealer</Link>
                        </div>
                        <div className="flex flex-col sm:flex-row  gap-3 w-full place-items-center sm:place-content-center mt-10">
                            <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg h-fit hover:bg-sky-100" onClick={() => numberOfPropertiesAdded ? navigate('/field-agent/properties-added') : null}>
                                <p className="text-5xl text-green-800">{numberOfPropertiesAdded}</p>
                                <p className="w-36">properties have been added by you</p>
                            </div>
                            <div className="flex flex-row border border-gray-400 gap-2 p-1 cursor-pointer rounded-lg h-fit hover:bg-sky-100" onClick={() => numberOfPropertyDealersAdded ? navigate('/field-agent/list-of-property-dealers-added-by-field-agent') : null}>
                                <p className="text-5xl text-green-800">{numberOfPropertyDealersAdded}</p>
                                <p className="w-40">property dealers have been added by you</p>
                            </div>
                        </div>
                    </div>
                </div>}

        </Fragment>
    )
}
export default HomeFieldAgent