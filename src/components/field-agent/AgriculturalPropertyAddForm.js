import { Fragment, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AlertModal from '../AlertModal'
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts'
import PunjabTehsilsDropdown from "./tehsilsDropdown/Punjab"
import ReviewAgriculturalPropertyAfterSubmission from "./ReviewAgriculturalPropertyAfterSubmission"
import { capitaliseFirstAlphabetsOfAllWordsOfASentence } from "../../utils/stringUtilityFunctions"
import Spinner from "../Spinner"

//This component is a form used by a field agent to add an agricultural property
function AgriculturalPropertyAddForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        if (!authToken) {
            navigate('/field-agent/signIn', { replace: true })
        }
    }, [authToken, navigate])

    const queryParams = new URLSearchParams(location.search)
    const propertyDealerId = queryParams.get('id') //we get the proeprty dealer ID from query params
    const propertyDealerLogoUrl = queryParams.get('logoUrl') //we get the proeprty dealer logo url from query params
    const propertyDealerFirmName = queryParams.get('firmName') //we get the proeprty dealer firm name from query params

    const [spinner, setSpinner] = useState(true)

    useEffect(() => {
        //if propertyDealerId or propertyDealerLogoUrl or propertyDealerFirmName is not available, we route to the field agent home page
        if (!propertyDealerId || !propertyDealerLogoUrl || !propertyDealerFirmName) {
            navigate('/field-agent', { replace: true })
        } else {
            setSpinner(false)
        }
    }, [propertyDealerId, propertyDealerLogoUrl, propertyDealerFirmName, navigate])

    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: '',
        routeTo: null
    })

    const [landSize, setLandSize] = useState('') //Land size in number
    const [landSizeUnit, setLandSizeUnit] = useState('') //Unit of land size
    const [landSizeDetails, setLandSizeDetails] = useState('') //details of land size
    const [landSizeError, setLandSizeError] = useState(false) //error if land size is not provided
    const [landSizeUnitError, setLandSizeUnitError] = useState(false) //error if land size unit is not provided

    const [state, setState] = useState('')
    const [stateError, setStateError] = useState(false)
    const [district, setDistrict] = useState('')
    const [districtError, setDistrictError] = useState(false)
    const [city, setCity] = useState('')
    const [tehsil, setTehsil] = useState('')
    const [village, setVillage] = useState('')

    const [agriculturalLandImageError, setAgriculturalLandImageError] = useState(false) //Error will be true if agriculturalLandImageError array is empty
    const [agriculturalLandImages, setAgriculturalLandImages] = useState([])

    const [contractImages, setContractImages] = useState([])

    const [numberOfOwners, setNumberOfOwners] = useState(1)

    const [isCanal, setIsCanal] = useState(false) //Will be true if user selects the canal option
    const [canalNameArray, setCanalNameArray] = useState([]) //canal names added by user will be added to this array
    const [newCanal, setNewCanal] = useState('') //The new canal that user adds will be stored here
    const [canalNameError, setCanalNameError] = useState(false) //if canal option is selected by the user and no canal is added this state will be true, and vice-versa
    const [isRiver, setIsRiver] = useState(false)  //Will be true if user selects the river option
    const [riverNameArray, setRiverNameArray] = useState([]) //river names added by user will be added to this array
    const [newRiver, setNewRiver] = useState('') //The new river that user adds will be stored here
    const [riverNameError, setRiverNameError] = useState(false)  //if river option is selected by the user and no river is added this state will be true, and vice-versa
    const [isTubeWell, setIsTubewell] = useState(false)  //Will be true if user selects the tubewell option
    const [tubewellDepthArray, setTubewellDepthArray] = useState([]) //tubewell depth added by user will be added to this array
    const [newTubewell, setNewTubewell] = useState('') //The new tubewell that user adds will be stored here
    const [tubewellDepthError, setTubewellDepthError] = useState(false) //if tubewell option is selected by the user and no tubewell is added this state will be true, and vice-versa
    const [waterSourceError, setWaterSourceError] = useState(false) //if none of canal, river and tubewell option is selected or no data is provided, this state becomes true

    const [isReservoir, setIsReservoir] = useState(null) //Will be true if user selects the yes opotion and and false if user selects the no option. will be null initially when no user action has taken place
    const [typeOfReservoir, setTypeOfReservoir] = useState([]) //this array contains the type of reservoir selected. There are 2 types os reservoir: public and private. The user can select both of them
    const [unitOfCapacityForPrivateReservoir, setUnitOfCapacityForPrivateReservoir] = useState('') //In case a private reservoir is selected, this setate contains the unit of capacity
    const [capacityOfPrivateReservoir, setCapacityOfPrivateReservoir] = useState('') ////In case a private reservoir is selected, this setate contains the capacity of reservoir
    const [reservoirError, setReservoirError] = useState(false) //If no option is selected, an error is shown and this state becomes true
    const [typeOfReservoirError, setTypeOfReservoirError] = useState(false) //if no type of reservoir is selected, this state becomes true
    const [capacityOfReservoirError, setCapacityOfReservoirError] = useState(false) //If capacity of private reservoir is not provided, this state becomes true
    const [unitOfCapacityReservoirError, setUnitOfCapacityReservoirError] = useState(false) //If capacity of private reservoir is not provided, this state becomes false

    const irrigationSystemOptions = ['Sprinkler', 'Drip', 'Underground pipeline']
    const [irrigationSystemArray, setIrrigationSystemArray] = useState([]) //This array contains all the irrigation system options selected by user

    const [priceDemandedNumber, setPriceDemandedNumber] = useState('') //Price in numbers
    const [priceDemandedNumberError, setPriceDemandedNumberError] = useState('') //This state is true if not price in numbers is provided
    const [priceDemandedWords, setPriceDemandedWords] = useState('') //price in words
    const [priceDemandedWordsError, setPriceDemandedWordsError] = useState(false) //This state is true if not price in words is provided

    const cropOptions = ['Rice', 'Wheat', 'Maize', 'Cotton']
    const [cropArray, setCropArray] = useState([]) //Array contans the crop selected by user
    const [cropError, setCropError] = useState(false) //state will be true if the cropArray is empty

    const [roadType, setRoadType] = useState('') //Type of road selected
    const [roadDetails, setRoadDetails] = useState('') //Details of the type of road
    const [roadError, setRoadError] = useState(false) //state is true if no road type is selected
    const roadOptions = ['Unpaved road', 'Village road', 'District road', 'State highway', 'National highway']

    const [isLegalRestrictions, setIsLegalRestrictions] = useState(null) //The state is true if the user clicks on yes option. It is false if user clicks on no option. It is null if no option is selected
    const [legalRestrictionError, setLegalRestrictionError] = useState(false) //if no option is elected by user, this state is true
    const [legalRestrictionDetails, setLegalRestrictionDetails] = useState('') //details ablout legal restrictions
    const [legalRestrictionDetailsError, setLegalRestrictionDetailsError] = useState(false) //If no details are provided, this state is true

    const [nearbyTown, setNearbyTown] = useState('')

    const states = ['Chandigarh', 'Punjab']

    const [propertyData, setPropertyData] = useState() //contains final property data added by user

    //This function is triggered when the user selects a proeprty image
    const agriculturalLandImageHandler = (event) => {
        setAgriculturalLandImageError(false)
        setAgriculturalLandImages(array => [...array, {
            file: URL.createObjectURL(event.target.files[0]),
            upload: event.target.files[0]
        }])
    }

    //This function is triggered when the user selects a contract image
    const contractImageHandler = (event) => {
        setContractImages(array => [...array, {
            file: URL.createObjectURL(event.target.files[0]),
            upload: event.target.files[0]
        }])
    }

    const arrayOfNumbersFromOneToTen = Array.apply(null, Array(10))
        .map(function (y, i) { return i + 1 })

    //This function triggers different errors if the user does not provide suitable data
    const errorCheckingBeforeSubmit = () => {
        if (!agriculturalLandImages.length) {
            setAgriculturalLandImageError(true)
        }

        if (!district.trim() && !state.trim()) {
            setDistrictError(true)
            setStateError(true)
        } else if (!district.trim() && state.trim()) {
            setDistrictError(true)
            setStateError(false)
        } else if (district.trim() && !state.trim()) {
            setDistrictError(false)
            setStateError(true)
        }

        if (!landSize) {
            setLandSizeError(true)
        }
        if (!landSizeUnit) {
            setLandSizeUnitError(true)
        }

        if (!priceDemandedNumber) {
            setPriceDemandedNumberError(true)
        }
        if (!priceDemandedWords.trim()) {
            setPriceDemandedWordsError(true)
        }

        if (!isCanal && !isRiver && !isTubeWell) {
            setWaterSourceError(true)
        } else {
            if (isCanal && canalNameArray.length === 0) {
                setCanalNameError(true)
            }
            if (isRiver && riverNameArray.length === 0) {
                setRiverNameError(true)
            }
            if (isTubeWell && tubewellDepthArray.length === 0) {
                setTubewellDepthError(true)
            }
        }

        if (isReservoir === null) {
            setReservoirError(true)
        } else {
            if (!typeOfReservoir.length) {
                setTypeOfReservoirError(true)
            } else if (typeOfReservoir.includes('private')) {
                if (!capacityOfPrivateReservoir) {
                    setCapacityOfReservoirError(true)
                }
                if (!unitOfCapacityForPrivateReservoir) {
                    setUnitOfCapacityReservoirError(true)
                }
            }
        }

        if (!cropArray.length) {
            setCropError(true)
        }

        if (!roadType) {
            setRoadError(true)
        }

        if (isLegalRestrictions === null) {
            setLegalRestrictionError(true)
        } else {
            if (isLegalRestrictions && !legalRestrictionDetails.trim()) {
                legalRestrictionDetailsError(true)
            }
        }
    }

    //this function is triggered when the user submits the form
    const formSubmit = async (e) => {
        e.preventDefault()

        //This function is triggered when the user does not provide suitable data
        const errorFunction = () => {
            errorCheckingBeforeSubmit()
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields',
                routeTo: null
            })
            return
        }

        //the if statements below are triggered if the user does not provide suitable data
        if (!agriculturalLandImages.length) {
            return errorFunction()
        }
        if (!district.trim() || !state.trim()) {
            return errorFunction()
        }
        if (!landSize || !landSizeUnit) {
            return errorFunction()
        }
        if (!priceDemandedNumber || !priceDemandedWords.trim()) {
            return errorFunction()
        }
        if ((!isCanal && !isRiver && !isTubeWell) || (isCanal && canalNameArray.length === 0) || (isRiver && riverNameArray.length === 0) || (isTubeWell && tubewellDepthArray.length === 0)) {
            return errorFunction(!cropArray.length)
        }
        if (!roadType) {
            return errorFunction()
        }
        if (isLegalRestrictions === null || (isLegalRestrictions && !legalRestrictionDetails.trim())) {
            return errorFunction()
        }
        if (isReservoir === null || (typeOfReservoir.includes('private') && (!capacityOfPrivateReservoir || !unitOfCapacityForPrivateReservoir))) {
            return errorFunction()
        }

        //The final property data to be submitted by user
        const finalPropertyData = {
            addedByPropertyDealer: propertyDealerId,
            landSize: {
                size: +landSize,
                unit: landSizeUnit,
                details: landSizeDetails.trim() && (landSizeDetails.trim()[0].toUpperCase() + landSizeDetails.trim().slice(1)),
            },
            location: {
                name: {
                    village: village.trim(),
                    city: city.trim(),
                    tehsil: tehsil,
                    district: district,
                    state: state
                }
            },
            numberOfOwners,
            waterSource: {
                canal: canalNameArray,
                river: riverNameArray,
                tubewells: {
                    numberOfTubewells: tubewellDepthArray.length,
                    depth: tubewellDepthArray
                }
            },
            reservoir: {
                isReservoir,
                type: typeOfReservoir,
                capacityOfPrivateReservoir: +capacityOfPrivateReservoir,
                unitOfCapacityForPrivateReservoir
            },
            irrigationSystem: irrigationSystemArray,
            priceDemanded: {
                number: +priceDemandedNumber,
                words: capitaliseFirstAlphabetsOfAllWordsOfASentence(priceDemandedWords.trim())
            },
            crops: cropArray,
            road: {
                type: roadType,
                details: roadDetails.trim() && (roadDetails.trim()[0].toUpperCase() + roadDetails.trim().slice(1)),
            },
            legalRestrictions: {
                isLegalRestrictions,
                details: legalRestrictionDetails.trim().toLowerCase(),
            },
            nearbyTown: nearbyTown.trim().toLowerCase(),
        }
        setPropertyData(finalPropertyData)
    }

    return (
        <Fragment>
            {spinner && !propertyData && <Spinner />}

            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} routeTo={alert.routeTo} alertModalRemover={() => {
                setAlert({
                    isAlertModal: false,
                    alertType: '',
                    alertMessage: '',
                    routeTo: null
                })
            }} />}

            {/*Once proeprty data is available, property data with be shown in a table in ReviewAgriculturalPropertyAfterSubmission component */}
            {propertyData && <ReviewAgriculturalPropertyAfterSubmission
                propertyData={propertyData}
                agriculturalLandImages={agriculturalLandImages}
                contractImages={contractImages}
                propertyDataReset={() => setPropertyData(null)}
                firmName={propertyDealerFirmName} />}

            {!spinner && <div className={`pl-2 pr-2 mb-10 md:pl-0 md:pr-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur' : ''} ${propertyData ? 'fixed right-full' : ''}`} >

                <div className='fixed w-full top-16 pt-2 pb-2 pl-2 z-20 bg-white sm:bg-transparent'>
                    <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/field-agent', { replace: true })}>Home</button>
                </div>

                <p className="fixed w-full text-center top-28 sm:top-16 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-10">Add an agricultural property by filling the form</p>

                <form className="w-full min-h-screen mt-48 sm:mt-36 md:w-10/12 lg:w-8/12  h-fit pt-4 pb-4 flex flex-col rounded border-2 border-gray-200 shadow-2xl" onSubmit={formSubmit}>

                    {/*property dealer firm name and logo */}
                    <div className="flex flex-col md:flex-row place-items-center md:place-content-center  gap-3 mb-10 ">
                        <p className="text-3xl font-bold text-gray-500 w-fit text-center">{propertyDealerFirmName}</p>
                        {propertyDealerLogoUrl && <img className="w-20 h-auto " src={propertyDealerLogoUrl} alt='' />}
                    </div>

                    {/* contract*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5">
                            <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Upload images of contract between seller and dealer (optional)</label>
                            <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={contractImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {contractImages.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {contractImages.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image.file} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = contractImages.filter(item => item.file !== image.file)
                                        setContractImages(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                    </div>

                    {/*location */}
                    <div className="flex flex-col p-2 pb-5 pt-5">
                        {districtError && !stateError && <p className="text-red-500">Select a state</p>}
                        {stateError && !districtError && <p className="text-red-500">Select a district</p>}
                        {stateError && districtError && <p className="text-red-500">Select district and state</p>}

                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <p className="text-xl font-semibold text-gray-500" htmlFor="location">Property location</p>
                        </div>
                        <div className="flex flex-col place-self-center w-11/12 gap-2">
                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="village">Village</label>
                                <input type="text" id="village" name="village"
                                    className='border-2 border-gray-500  p-1 rounded' autoComplete="new-password" value={village} onChange={e => {
                                        setVillage(e.target.value)
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="city">City/Town</label>
                                <input type="text" id="city" name="city"
                                    className='border-2 border-gray-500 p-1 rounded' autoComplete="new-password" value={city} onChange={e => {
                                        setCity(e.target.value)
                                    }} />
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="state">State</label>
                                </div>

                                <select className={`border-2 ${stateError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`} name="state" id="state" value={state} onChange={e => {
                                    setStateError(false)
                                    setState(e.target.value)
                                    setDistrict('')
                                    setTehsil('')
                                }}>
                                    <option className="text-gray-500 font-semibold" value="" disabled>Select a state:</option>
                                    {states.map(state => {
                                        return <option key={state} value={state}>{state}</option>
                                    })}
                                </select>
                                {stateError && <p className="text-red-500">Select a state</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className="text-gray-500 font-semibold" htmlFor="district">District</label>
                                </div>
                                <select className={`border-2 ${districtError ? 'border-red-500' : 'border-gray-500'}  p-1 rounded`} name="district" id="district" value={district} disabled={state ? false : true} onChange={e => {
                                    setDistrictError(false)
                                    setDistrict(e.target.value)
                                    setTehsil('')
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a district</option>
                                    {state === 'Punjab' && punjabDistricts.map(district => {
                                        return <option key={district} value={district}>{district}</option>
                                    })}
                                    {state === 'Chandigarh' &&
                                        <option value="Chandigarh">Chandigarh</option>}
                                </select>
                                {districtError && <p className="text-red-500">Select a district</p>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">Tehsil</label>
                                <select className='border-2 border-gray-500 p-1 rounded' name="state" id="state" disabled={state && district ? false : true} value={tehsil} onChange={e => {
                                    setTehsil(e.target.value)
                                }}>
                                    <option className="font-semibold" value="" disabled>Select a tehsil</option>
                                    {state === 'Chandigarh' && district === 'Chandigarh' &&
                                        <option value='Chandigarh'>Chandigarh</option>}
                                    {state === 'Punjab' && <>
                                        <PunjabTehsilsDropdown district={district} />
                                    </>}
                                </select>
                            </div>
                            {/*<div className="flex flex-col w-full">
                                <label className="text-gray-500 font-semibold" htmlFor="state">Location on Map</label>
                                <div className="w-full">
                                    <MapComponent apiKey={process.env.REACT_APP_GOOGLE_API_KEY} />
                                </div>
                            </div>*/}
                        </div>
                    </div>

                    {/* Number of owners*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500" htmlFor="owners">Number of owners</label>
                            <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="owners" id="owners" value={numberOfOwners} onChange={e => {
                                setNumberOfOwners(e.target.value)
                            }}>
                                {arrayOfNumbersFromOneToTen.map(number => <option key={number} value={number}>{number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/*land size*/}
                    <div className="flex flex-col p-2 pb-5 pt-5">
                        {landSizeError && !landSizeUnitError && <p className="text-red-500 -mt-1">Provide land size</p>}
                        {landSizeError && landSizeUnitError && <p className="text-red-500 -mt-1">Provide land size and unit</p>}
                        {!landSizeError && landSizeUnitError && <p className="text-red-500 -mt-1">Provide a unit</p>}
                        <div className="flex flex-row gap-5 sm:gap-16">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="size">Land size</label>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-row gap-1">
                                    <input id="land-size" type="number" name='land-size' className={`border-2 ${landSizeError ? 'border-red-500' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-24`} placeholder="Size" value={landSize} onChange={e => {
                                        if (+e.target.value.trim() !== 0) {
                                            setLandSizeError(false)
                                            setLandSize(+e.target.value.trim())
                                        } else {
                                            setLandSize('')
                                        }
                                    }} />
                                    <select className={`border-2 ${landSizeUnitError ? 'border-red-500' : 'border-gray-400'} p-1 rounded cursor-pointer bg-white text-center h-fit`} name="unit-dropdown" id="unit-dropdown" value={landSizeUnit} onChange={e => {
                                        setLandSizeUnitError(false)
                                        setLandSizeUnit(e.target.value)
                                    }}>
                                        <option value='' disabled>Select unit</option>
                                        <option value='metre-square'>Metre Square</option>
                                        <option value='acre' >Acre</option>
                                    </select>
                                </div>
                                <textarea className="border-2 border-gray-400 rounded h-40 sm:w-80 p-1 resize-none" id="size" name="size" autoCorrect="on" autoComplete="new-password" placeholder="Add details regarding land size (optional)" value={landSizeDetails} onChange={e => {
                                    setLandSizeDetails(e.target.value)
                                }} />
                            </div>
                        </div>
                    </div>

                    {/*price*/}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        {(priceDemandedNumberError || priceDemandedWordsError) && <p className="text-red-500 -mt-1">Provide a price</p>}
                        <div className="flex flex-row gap-5 sm:gap-16">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-xl font-semibold text-gray-500 whitespace-nowrap" htmlFor="size">Price (Rs)</label>
                            </div>

                            <div className="flex flex-col gap-5">
                                <input id="price-number" type="number" name='price-number' className={`border-2 ${priceDemandedNumberError ? 'border-red-400' : 'border-gray-400'} pl-1 pr-1 rounded bg-white w-40`} placeholder="Number" value={priceDemandedNumber} onChange={e => {
                                    if (+e.target.value.trim() !== 0) {
                                        setPriceDemandedNumberError(false)
                                        setPriceDemandedNumber(+e.target.value.trim())
                                    } else {
                                        setPriceDemandedNumber('')
                                    }
                                }} />
                                <textarea className={`border-2 ${priceDemandedWordsError ? 'border-red-400' : 'border-gray-400'} p-1 rounded w-56 sm:w-80 resize-none`} id="price-words" rows={3} name="price-words" autoCorrect="on" autoComplete="new-password" placeholder="Words" value={priceDemandedWords} onChange={e => {
                                    setPriceDemandedWordsError(false)
                                    setPriceDemandedWords(e.target.value)
                                }} />
                            </div>
                        </div>
                    </div>

                    {/*water source */}
                    <div className="p-2 pb-5 pt-5">
                        {waterSourceError && <p className="text-red-500">Select atleast one water source</p>}
                        {(canalNameError || riverNameError || tubewellDepthError) && <p className="text-red-500">Provide information regarding water sources</p>}

                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Water source</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                                <div className="flex flex-col">
                                    <div>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id="canal" name="canal" onChange={e => {
                                            setCanalNameError(false)
                                            setWaterSourceError(false)
                                            if (e.target.checked) {
                                                setIsCanal(true)
                                            } else {
                                                setIsCanal(false)
                                                setCanalNameArray([])
                                                setNewCanal('')
                                            }
                                        }} />
                                        <label htmlFor="canal">Canal</label>
                                    </div>
                                    {isCanal && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                        <thead>
                                            <tr className="border border-gray-300">
                                                <th className="pl-1 pr-1">Canal name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border border-gray-300 text-center ">
                                            {canalNameArray.length > 0 && canalNameArray.map((canal) => {
                                                return <tr key={Math.random()} className="border border-gray-300">
                                                    <td className="pt-1 pb-1 flex flex-row">
                                                        <p className="w-full">{canal}</p>
                                                        <button type='button' className="pl-1.5 pr-1.5 bg-red-400 text-white text-xl font-semibold" onClick={e => {
                                                            e.stopPropagation()
                                                            const updatedArray = canalNameArray.filter(item => item !== canal)
                                                            setCanalNameArray(updatedArray)
                                                        }}>X</button>
                                                    </td>
                                                </tr>
                                            })}
                                            <tr className="border border-gray-300">
                                                <td className="flex flex-row place-content-center p-1">
                                                    <input type="text" id="depth" name="depth"
                                                        className={`w-28 border ${canalNameError ? 'border-red-500' : 'border-gray-500'} border-gray-500 pl-1 pr-1`} autoComplete="new-password" value={newCanal} onChange={e => {
                                                            setNewCanal(e.target.value)
                                                            setCanalNameError(false)
                                                        }} />
                                                    <button type='button' className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={e => {
                                                        e.stopPropagation()
                                                        if (newCanal.trim()) {
                                                            setCanalNameError(false)
                                                            setCanalNameArray(canalNameArray => [...canalNameArray, newCanal])
                                                            setNewCanal('')
                                                        }
                                                    }}>+</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>}
                                </div>

                                <div className="flex flex-col">
                                    <div>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id="river" name="river" onChange={e => {
                                            setWaterSourceError(false)
                                            setRiverNameError(false)
                                            if (e.target.checked) {
                                                setIsRiver(true)
                                            } else {
                                                setIsRiver(false)
                                                setRiverNameArray([])
                                                setNewRiver('')
                                            }
                                        }} />
                                        <label htmlFor="river">River</label>
                                    </div>
                                    {isRiver && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                        <thead>
                                            <tr className="border border-gray-300">
                                                <th className="pl-1 pr-1">River name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border border-gray-300 text-center ">
                                            {riverNameArray.length > 0 && riverNameArray.map((river) => {
                                                return <tr key={Math.random()} className="border border-gray-300">
                                                    <td className="pt-1 pb-1 flex flex-row">
                                                        <p className="w-full">{river}</p>
                                                        <button type='button' className="pl-1.5 pr-1.5 bg-red-400 text-white text-xl font-semibold" onClick={e => {
                                                            e.stopPropagation()
                                                            const updatedArray = riverNameArray.filter(item => item !== river)
                                                            setRiverNameArray(updatedArray)
                                                        }}>X</button>
                                                    </td>
                                                </tr>
                                            })}
                                            <tr className="border border-gray-300">

                                                <td className="flex flex-row place-content-center p-1">
                                                    <input type="text" id="depth" name="depth"
                                                        className={`w-28 border ${riverNameError ? 'border-red-500' : 'border-gray-500'} border-gray-500 pl-1 pr-1`} autoComplete="new-password" value={newRiver} onChange={e => {
                                                            setNewRiver(e.target.value)
                                                            setRiverNameError(false)
                                                        }} />
                                                    <button type='button' className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={() => {
                                                        if (newRiver.trim()) {
                                                            setRiverNameError(false)
                                                            setRiverNameArray(riverNameArray => [...riverNameArray, newRiver.trim()])
                                                            setNewRiver('')
                                                        }
                                                    }}>+</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>}
                                </div>

                                <div className="">
                                    <input className="mr-1 cursor-pointer" type="checkbox" id="tubewell" name="tubewell" value="tubewell" onChange={e => {
                                        setWaterSourceError(false)
                                        setTubewellDepthError(false)
                                        if (e.target.checked) {
                                            setIsTubewell(true)
                                        } else {
                                            setIsTubewell(false)
                                            setTubewellDepthArray([])
                                            setNewTubewell('')
                                        }
                                    }} />
                                    <label htmlFor="tubewell">Tubewell</label>
                                    <div className="">
                                        {isTubeWell && <table className="table-auto bg-white border border-gray-300 ml-5 sm:ml-0">
                                            <thead>
                                                <tr className="border border-gray-300">
                                                    <th className="pl-1 pr-1">Depth (feet)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border border-gray-300 text-center ">
                                                {tubewellDepthArray.length > 0 && tubewellDepthArray.map((tubewell) => {
                                                    return <tr key={Math.random()} className="border border-gray-300">
                                                        <td className="pt-1 pb-1 flex flex-row">
                                                            <p className="w-full">{tubewell}</p>
                                                            <button type='button' className="pl-1.5 pr-1.5 bg-red-400 text-white text-xl font-semibold" onClick={e => {
                                                                e.stopPropagation()
                                                                const updatedArray = tubewellDepthArray.filter(item => item !== tubewell)
                                                                setTubewellDepthArray(updatedArray)
                                                            }}>X</button>
                                                        </td>
                                                    </tr>
                                                })}
                                                <tr className="border border-gray-300">
                                                    <td className="flex flex-row place-content-center pt-1 pb-1">
                                                        <input type="number" id="depth" name="depth"
                                                            className={`w-28 border ${tubewellDepthError ? 'border-red-500' : 'border-gray-500'} border-gray-500 pl-1 pr-1`} autoComplete="new-password" value={newTubewell} onChange={e => {
                                                                if (+e.target.value.trim() !== 0) {
                                                                    setNewTubewell(+e.target.value.trim())
                                                                    setTubewellDepthError(false)
                                                                } else {
                                                                    setNewTubewell('')
                                                                }
                                                            }} />
                                                        <button type='button' className="pl-1.5 pr-1.5 bg-gray-700 text-white text-xl font-semibold" onClick={() => {
                                                            if (newTubewell) {
                                                                setTubewellDepthError(false)
                                                                setTubewellDepthArray(tubewellDepthArray => [...tubewellDepthArray, newTubewell])
                                                                setNewTubewell('')
                                                            }
                                                        }}>+</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* reservoir*/}
                    <div className="p-2 pb-5 pt-5 bg-gray-100">
                        {reservoirError && <p className="text-red-500 -mt-1">Select an option</p>}
                        <div className="flex flex-col sm:flex-row  sm:gap-10 lg:gap-16 mb-2">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Does the land have access to a reservoir</p>
                            </div>
                            <div className="flex flex-row place-content-center gap-4 pt-1">
                                <div className="flex flex-row h-fit">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row">
                                            <input className="mr-1 cursor-pointer" type="radio" id="yes-reservoir" name="reservoir" onChange={e => {
                                                setReservoirError(false)
                                                setTypeOfReservoirError(false)
                                                setCapacityOfReservoirError(false)
                                                setUnitOfCapacityReservoirError(false)
                                                setTypeOfReservoir([])
                                                if (e.target.checked) {
                                                    setIsReservoir(true)
                                                }
                                            }} />
                                            <label htmlFor="yes-reservoir">Yes</label>
                                        </div>

                                        {isReservoir && <>
                                            <div className="bg-gray-100 p-2 rounded w-fit bg-white">
                                                <p className="font-semibold mb-1">Type of reservoir</p>
                                                <div className="flex flex-row h-fit">
                                                    <input className="mr-1 cursor-pointer" type="checkbox" id="public-reservoir" name="public-reservoir" onChange={e => {
                                                        setTypeOfReservoirError(false)
                                                        if (e.target.checked) {
                                                            setTypeOfReservoir(array => [...array, 'public'])
                                                        } else {
                                                            if (typeOfReservoir.length === 1) {
                                                                setTypeOfReservoir([])
                                                            } else {
                                                                setTypeOfReservoir(['private'])
                                                            }
                                                        }
                                                    }} />
                                                    <label htmlFor="public-reservoir">Public Reservoir</label>
                                                </div>
                                                <div className="flex flex-row h-fit">
                                                    <input className="mr-1 cursor-pointer" type="checkbox" id="reservoir" name="private-reservoir" onChange={e => {
                                                        setTypeOfReservoirError(false)
                                                        if (e.target.checked) {
                                                            setCapacityOfPrivateReservoir('')
                                                            setUnitOfCapacityForPrivateReservoir('')
                                                            setTypeOfReservoir(array => [...array, 'private'])
                                                        } else {
                                                            if (typeOfReservoir.length === 1) {
                                                                setTypeOfReservoir([])
                                                            } else {
                                                                setTypeOfReservoir(['public'])
                                                            }
                                                        }
                                                    }} />
                                                    <label htmlFor="private-reservoir">Private Reservoir</label>
                                                </div>
                                            </div>
                                            {typeOfReservoirError && <p className="text-red-500 -mt-1">Select atleast one type</p>}

                                            {typeOfReservoir.length > 0 && typeOfReservoir.includes('private') &&
                                                <><div className="bg-gray-100 p-2 rounded flex flex-col bg-white">
                                                    <p className="font-semibold mb-1">Capacity of private reservoir</p>
                                                    <div className="flex flex-row gap-1">
                                                        <input id="resercoir-capacity" type="number" name='reservoir-capacity' className={`border-2 ${capacityOfReservoirError ? 'border-red-400' : 'border-gray-400'} border-gray-400 rounded bg-white w-24 p-1`} min="0" placeholder="Capacity" value={capacityOfPrivateReservoir} onChange={e => {
                                                            if (+e.target.value.trim() !== 0) {
                                                                setCapacityOfReservoirError(false)
                                                                setCapacityOfPrivateReservoir(+e.target.value.trim())
                                                            } else {
                                                                setCapacityOfPrivateReservoir('')
                                                            }
                                                        }} />
                                                        <select className={`border-2 ${unitOfCapacityReservoirError ? 'border-red-400 ' : 'border-gray-400 '} rounded cursor-pointer bg-white text-center h-fit p-1 pb-1.5`} name="reservoir-capacity-dropdown" id="reservoir-capacity-dropdown" value={unitOfCapacityForPrivateReservoir} onChange={e => {
                                                            setUnitOfCapacityReservoirError(false)
                                                            setUnitOfCapacityForPrivateReservoir(e.target.value)
                                                        }}>
                                                            <option value='' disabled>Select a unit</option>
                                                            <option value='cusec'>Cusec</option>
                                                            <option value='litre' >Litre</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                    {capacityOfReservoirError && unitOfCapacityReservoirError && <p className="text-red-500 -mt-1">Provide capacity and select a unit</p>}
                                                    {!unitOfCapacityReservoirError && capacityOfReservoirError && <p className="text-red-500 -mt-1">Provide capacity</p>}
                                                    {unitOfCapacityReservoirError && !capacityOfReservoirError && <p className="text-red-500 -mt-1">Select a unit</p>}
                                                </>}</>}
                                    </div>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="no-reservoir" name="reservoir" onChange={e => {
                                        setReservoirError(false)
                                        if (e.target.checked) {
                                            setIsReservoir(false)
                                        }
                                    }} />
                                    <label htmlFor="no-reservoir">No</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* irrigation system*/}
                    <div className="p-2 pb-5 pt-5">
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <p className="text-xl font-semibold text-gray-500">Irrigation system</p>
                            <div className="flex flex-col gap-1.5 mt-1">
                                {irrigationSystemOptions.map(system => {
                                    return <div key={system}>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id={system} name={system} value={system} onChange={e => {
                                            if (e.target.checked) {
                                                setIrrigationSystemArray(array => [...array, e.target.value])
                                            } else {
                                                const filteredArray = irrigationSystemArray.filter(type => type !== e.target.value)
                                                setIrrigationSystemArray(filteredArray)
                                            }
                                        }} />
                                        <label htmlFor={system}>{system[0].toUpperCase() +
                                            system.slice(1)}</label>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    {/*crop */}
                    <div className="p-2 pb-5 pt-5 bg-gray-100">
                        {cropError && <p className="text-red-500">Select atleast one crop</p>}
                        <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500">Suitable for crops</p>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-1">
                                {cropOptions.map(crop => {
                                    return <div key={crop}>
                                        <input className="mr-1 cursor-pointer" type="checkbox" id={crop} name={crop} value={crop} onChange={e => {
                                            setCropError(false)
                                            if (e.target.checked) {
                                                setCropArray(array => [...array, e.target.value])
                                            } else {
                                                const filteredArray = cropArray.filter(type => type !== e.target.value)
                                                setCropArray(filteredArray)
                                            }
                                        }} />
                                        <label htmlFor={crop}>{crop[0].toUpperCase() +
                                            crop.slice(1)}</label>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    {/*road type */}
                    <div className="flex flex-col p-2 pb-5 pt-5">
                        {roadError && <p className="text-red-500 -mt-1">Select atleast one road type</p>}
                        <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="flex flex-row gap-5 sm:gap-10 lg:gap-16 ">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <p className="text-xl font-semibold text-gray-500">Road connectivity</p>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    {roadOptions.map(road => {
                                        return <div key={road}>
                                            <input className="mr-1 cursor-pointer" type="radio" id={road} name="road" value={road} onChange={e => {
                                                setRoadError(false)
                                                if (e.target.checked) {
                                                    setRoadType(e.target.value)
                                                }
                                            }} />
                                            <label htmlFor={road}>{road[0].toUpperCase() +
                                                road.slice(1)}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="text-center">
                                <textarea className="border-2 border-gray-400 p-1 rounded h-40  w-60 md:w-68 lg:w-80 resize-none" id="road-remark" name="road-remark" autoCorrect="on" autoComplete="new-password" placeholder="Add details about road here (optional)" onChange={e => setRoadDetails(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/*laws */}
                    <div className="p-2  flex flex-col pb-5 pt-5 bg-gray-100">
                        {legalRestrictionError && <p className="text-red-500">Select an option</p>}
                        <div className="flex flex-row gap-8 sm:gap-10 lg:gap-16 mb-2">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <p className="text-xl font-semibold text-gray-500 mb-2">Is the land under any restrictions under any laws</p>
                            </div>
                            <div className="flex flex-row gap-4 pt-1 pr-4 sm:pr-0">
                                <div className="flex flex-row h-fit">
                                    <input className="mr-1 cursor-pointer" type="radio" id="yes" name="restrictions" value="yes" onChange={e => {
                                        setLegalRestrictionDetails('')
                                        setLegalRestrictionDetailsError(false)
                                        setLegalRestrictionError(false)
                                        if (e.target.checked) {
                                            setIsLegalRestrictions(true)
                                        }
                                    }} />
                                    <label htmlFor="yes">Yes</label>
                                </div>

                                <div className="flex flex-row h-fit">
                                    <input className=" mr-1 cursor-pointer" type="radio" id="no" name="restrictions" value="no" onChange={e => {
                                        setLegalRestrictionDetails('')
                                        setLegalRestrictionDetailsError(false)
                                        setLegalRestrictionError(false)
                                        if (e.target.checked) {
                                            setIsLegalRestrictions(false)
                                        }
                                    }} />
                                    <label htmlFor="no">No</label>
                                </div>
                            </div>
                        </div>
                        {isLegalRestrictions && <div className="text-center">
                            <textarea className={`border-2 ${legalRestrictionDetailsError ? 'border-red-400' : 'border-gray-400'} rounded h-40 w-80 p-1 resize-none`} id="restrictions" name="restrictions" autoCorrect="on" autoComplete="new-password" placeholder="Add details about restrictions" value={legalRestrictionDetails} onChange={e => {
                                setLegalRestrictionDetailsError(false)
                                setLegalRestrictionDetails(e.target.value)
                            }} />
                            {legalRestrictionDetailsError && <p className="text-red-500">Provide details</p>}
                        </div>}
                    </div>

                    {/*nearby town */}
                    <div className="flex flex-col p-2 pb-5 pt-5  ">
                        <div className="flex flex-col sm:flex-row sm:gap-10 lg:gap-16">
                            <label className="text-xl font-semibold text-gray-500 pb-1" htmlFor="nearby-town">Nearby town (optional)</label>
                            <input type="text" id="nearby-town" name="nearby-town"
                                className='sm:w-72 border-2 border-gray-500  p-1 rounded' autoComplete="new-password" value={nearbyTown} onChange={e => setNearbyTown(e.target.value)} />
                        </div>
                    </div>

                    {/*images */}
                    <div className="flex flex-col p-2 pb-5 pt-5 bg-gray-100">
                        {agriculturalLandImageError && <p className="text-red-500 -mt-0.5 sm:-mt-2 pt-3">Select an image</p>}
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-row gap-0.5">
                                <p className="h-4 text-2xl text-red-500">*</p>
                                <label className="text-gray-500 text-xl font-semibold" htmlFor="image">Add property image</label>
                            </div>
                            <input type="file" className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={agriculturalLandImageHandler} onClick={e => e.target.value = null} />
                        </div>
                        {agriculturalLandImages.length !== 0 && <div className='flex flex-wrap justify-center gap-5 p-5'>
                            {agriculturalLandImages.map(image => {
                                return <div key={Math.random()} className='relative w-fit bg-blue-300'>
                                    <img className='relative w-auto h-60' src={image.file} alt="" />
                                    <div className='absolute top-0 right-0 text-2xl bg-white font-bold border-2 border-gray-500 pl-1 pr-1 cursor-pointer' onClick={() => {
                                        const updatedState = agriculturalLandImages.filter(item => item.file !== image.file)
                                        setAgriculturalLandImages(updatedState)
                                    }}>X</div>
                                </div>
                            })}
                        </div>}
                    </div>

                    <div className="flex justify-center mt-4 p-2">
                        <button type='submit' className="w-full bg-green-500 text-white font-medium rounded pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">Save</button>
                    </div>

                </form>
            </div >}
        </Fragment >
    )
}
export default AgriculturalPropertyAddForm