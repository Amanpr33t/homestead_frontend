import { Fragment, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AlertModal from '../AlertModal'
import ReviewPropertyDealerSignUpData from './ReviewPropertyDealerSignUpData'
import { punjabDistricts } from '../../utils/tehsilsAndDistricts/districts'
import Spinner from "../Spinner"

//This component is a div used by a field agent to add a property dealer
function PropertyDealerDetails() {
    const navigate = useNavigate()

    const [spinner, setSpinner] = useState(true)
    const [alert, setAlert] = useState({
        isAlertModal: false,
        alertType: '',
        alertMessage: ''
    }) //This state is used to manage alerts
    const authToken = localStorage.getItem("homestead-property-dealer-authToken")

    //This code in useEffect hook is used to scroll the page to top 
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [])

    const [dealerDetails, setDealerDetails] = useState(null)

    const [editDetails, setEditDetails] = useState(false)

    const [firmName, setFirmName] = useState('') //Name of the firm
    const [firmNameError, setFirmNameError] = useState(false) //Used to set error in case no firm name is provided

    const [propertyDealerName, setPropertyDealerName] = useState('') //Name of the property dealer
    const [propertyDealerNameError, setPropertyDealerNameError] = useState(false) //Used to set the error in case property dealer name is not provided

    const [experience, setExperience] = useState(0) //Used to set experience

    const [flatPlotHouseNumber, setFlatPlotHouseNumber] = useState('') //Used td store flat or house number
    const [flatPlotHouseNumberError, setFlatPlotHouseNumberError] = useState(false) //used to show error when flat or house number is not provided

    const [areaSectorVillage, setAreaSectorVillage] = useState('') //Used to store name of area or village
    const [areaSectorVillageError, setAreaSectorVillageError] = useState(false) // Used to show error when area is not provided

    const [landmark, setLandmark] = useState('') //Used to set landmark

    const [postalCode, setPostalCode] = useState('') //Used to set postal code
    const [postalCodeError, setPostalCodeError] = useState(false) //Used to show error when no postal code is provided or postal code is more than 6 characters

    const [city, setCity] = useState('') //Used to set city
    const [cityError, setCityError] = useState(false) //Used to show error when no city is provided 

    const [district, setDistrict] = useState('') //Used to set district
    const [districtError, setDistrictError] = useState(false) //Used to show error when no district is provided

    const [state, setState] = useState('') //Used to set state
    const [stateError, setStateError] = useState(false) //Used to set error when no state is provided
    const states = ['Chandigarh', 'Punjab']

    const [addressArray, setAddressArray] = useState([]) //stores all the addresses added. Addresses are stored in an array
    const [addressError, setAddressError] = useState(false) //Used to show error when no address is provided, i.e. addressArray is empty

    const [about, setAbout] = useState('') //Used to set about
    const [aboutMoreThanOneFiftyWords, setAboutMoreThanOneFiftyWords] = useState(false) //used to show an error when about is more than 150 words

    const [gstNumber, setGstNumber] = useState('') //used to set GST number
    const [reraNumber, setReraNumber] = useState('')

    const [firmLogoImageUpload, setFirmLogoImageUpload] = useState() //used to store the entire image object to be sent to the database
    const [firmLogoImageFile, setFirmLogoImageFile] = useState() //Used to store image file string

    const [email, setEmail] = useState('')
    const [contactNumber, setContactNumber] = useState('')

    //This fuction is used to manage the image selected by the user
    const imageChangeHandler = (event) => {
        //setFirmLogoImageFileError(false)
        setFirmLogoImageFile(URL.createObjectURL(event.target.files[0]))
        setFirmLogoImageUpload(event.target.files[0])
    }

    //This fuction is used to store the address
    const addAddress = () => {
        if (!flatPlotHouseNumber.trim() || !areaSectorVillage.trim() || (postalCode.toString().length !== 6) || !city.trim() || !state.trim() || !district.trim() || aboutMoreThanOneFiftyWords) {
            if (!flatPlotHouseNumber.trim()) {
                setFlatPlotHouseNumberError(true)
            }
            if (!areaSectorVillage.trim()) {
                setAreaSectorVillageError(true)
            }
            if (postalCode.toString().length !== 6) {
                setPostalCodeError(true)
            }
            if (!city.trim()) {
                setCityError(true)
            }
            if (!state.trim()) {
                setStateError(true)
            }
            if (!district.trim()) {
                setDistrictError(true)
            }
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields for address'
            })
            return
        }

        const newAddress = {
            addressId: (addressArray.length + 1).toString(), flatPlotHouseNumber, areaSectorVillage, landmark, postalCode: +postalCode, city, state, district
        }
        setAddressArray(addressArray => [...addressArray, newAddress])
        setFlatPlotHouseNumber('')
        setAreaSectorVillage('')
        setLandmark('')
        setPostalCode('')
        setCity('')
        setState('')
    }

    //This function is used to submit the div once the save button is clicked
    const formSubmit = e => {
        e.preventDefault()
        if (!firmName.trim() || !propertyDealerName.trim() || !addressArray.length) {
            if (!firmName.trim()) {
                setFirmNameError(true)
            }
            if (!propertyDealerName.trim()) {
                setPropertyDealerNameError(true)
            }
            if (!addressArray.length) {
                setAddressError(true)
                setFlatPlotHouseNumberError(false)
                setAreaSectorVillageError(false)
                setPostalCodeError(false)
                setCityError(false)
                setStateError(false)
            }
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Provide all fields'
            })
            return
        }

    }

    //This function is used to submit the div once the save button is clicked
    const fetchDealerDetails = useCallback(async () => {
        try {
            setSpinner(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/property-dealer/getDealerDetails`, {
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
                setDealerDetails(data.details)
                setFirmName(data.details.firmName)
                setPropertyDealerName(data.details.propertyDealerName)
                setExperience(data.details.experience)
                setAddressArray(data.details.addressArray)
                setAbout(data.details.about)
                setGstNumber(data.details.gstNumber)
                setReraNumber(data.details.reraNumber)
                setFirmLogoImageFile(data.details.firmLogoUrl)
                setEmail(data.details.email)
                setContactNumber(data.details.contactNumber)
                setSpinner(false)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setSpinner(false)
            setAlert({
                isAlertModal: true,
                alertType: 'warning',
                alertMessage: 'Some error occured'
            })
            return
        }
    }, [authToken])

    useEffect(() => {
        fetchDealerDetails()
    }, [fetchDealerDetails])

    //This function is used to create an array of 51 numbers from 0-50
    const arrayOfFiftyNumbers = Array.apply(null, Array(51))
        .map(function (y, i) { return i })


    return (
        <Fragment>

            {/*The code bolow is used to show an alert modal to the user */}
            {alert.isAlertModal && <AlertModal message={alert.alertMessage} type={alert.alertType} alertModalRemover={() => setAlert({
                isAlertModal: false,
                alertType: '',
                alertMessage: ''
            })} />}

            {spinner && <Spinner />}

            {!spinner && <div className={`p-1 mb-10 sm:p-0 w-full flex flex-col place-items-center ${alert.isAlertModal ? 'blur-sm' : ''} $`} >
                <div className='fixed w-full top-20 pt-2 pb-2 pl-2 z-50 bg-white sm:bg-transparent'>
                    <button type='button' className="bg-green-500 text-white font-semibold rounded pl-2 pr-2 h-8" onClick={() => navigate('/property-dealer', { replace: true })}>Back</button>
                </div>

                <p className="fixed w-full text-center top-32 sm:top-20 pl-4 pr-4 pb-4 sm:pt-4 bg-white  text-xl font-bold z-40">{editDetails ? "Edit details" : "Review the details"}</p>

                <div className="w-full mt-40 sm:mt-36 sm:w-9/12 md:w-8/12 lg:w-7/12  h-fit flex flex-col rounded border-2 border-gray-200 shadow-2xl">

                    {/*Firm name */}
                    <div className="flex flex-col p-3  bg-gray-100">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="firmName">Name of the firm</label>
                        </div>
                        <input type="text" id="firmName" name="firmName" className={`border-2 border-gray-400 ${firmNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" disabled={!editDetails} value={firmName} onChange={e => {
                            setFirmName(e.target.value)
                            setFirmNameError(false)
                        }} />
                        {firmNameError && <p className="text-red-500">Provide a firm name</p>}
                    </div>

                    {/*dealer name */}
                    <div className="flex flex-col p-3">
                        <div className="flex flex-row gap-0.5">
                            <p className="h-4 text-2xl text-red-500">*</p>
                            <label className="text-lg font-semibold mb-0.5" htmlFor="dealerName">Property dealer name</label>
                        </div>
                        <input type="text" id="dealerName" name="dealerName" className={`border-2 ${propertyDealerNameError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} placeholder="Passord should be of 6 digits" autoComplete="new-password" disabled={!editDetails} value={propertyDealerName} onChange={e => {
                            setPropertyDealerName(e.target.value)
                            setPropertyDealerNameError(false)
                        }} />
                        {propertyDealerNameError && <p className="text-red-500">Provide property dealer's name</p>}
                    </div>

                    {/*Experience */}
                    <div className="flex flex-row gap-4 p-3  bg-gray-100">
                        <label className="text-lg font-semibold" htmlFor="state">Experience (years)</label>
                        <select className="border-2 border-gray-400 p-1 rounded cursor-pointer bg-white text-center" name="experience" id="experience" disabled={!editDetails} value={experience} onChange={e => {
                            setExperience(e.target.value)
                        }}>
                            {arrayOfFiftyNumbers.map(number => <option key={number} value={number}>{number}</option>)}
                        </select>
                    </div>

                    {/*address */}
                    <div className="flex flex-col p-3">
                        <p className="text-lg font-semibold" htmlFor="address">Office Address:</p>
                        {addressError && !addressArray.length && <p className="text-red-500 -mt-1">Provide atleast one address</p>}
                        <div className="flex flex-col pl-6 pr-6 gap-2">
                            {editDetails && <><div className="flex flex-col">
                                <div className="flex flex-row gap-0.5">
                                    <p className="h-4 text-2xl text-red-500">*</p>
                                    <label className=" font-semibold" htmlFor="number">Flat, House no., Building, Company</label>
                                </div>
                                <input type="text" id="number" name="number"
                                    className={`border-2 ${flatPlotHouseNumberError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" value={flatPlotHouseNumber} onChange={e => {
                                        setFlatPlotHouseNumber(e.target.value)
                                        setFlatPlotHouseNumberError(false)
                                        setAddressError(false)
                                    }} />
                                {flatPlotHouseNumberError && <p className="text-red-500">Provide a house or plot number</p>}
                            </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className="font-semibold" htmlFor="area">Area,Street, Sector, Village</label>
                                    </div>
                                    <input type="text" id="area" name="area" className={`border-2 ${areaSectorVillageError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" value={areaSectorVillage} onChange={e => {
                                        setAreaSectorVillage(e.target.value)
                                        setAreaSectorVillageError(false)
                                        setAddressError(false)
                                    }} />
                                    {areaSectorVillageError && <p className="text-red-500">Provide an area</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label className=" font-semibold" htmlFor="landmark">Landmark</label>
                                    <input type="text" id="landmark" name="landmark" className='border-2 border-gray-400 p-1 rounded' autoComplete="new-password" placeholder="E.g. near apollo hospital" value={landmark} onChange={e => {
                                        setLandmark(e.target.value)
                                        setAddressError(false)
                                    }} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className=" font-semibold" htmlFor="pincode">Pincode</label>
                                    </div>
                                    <input type="number" id="pincode" name="pincode" className={`border-2 ${postalCodeError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" placeholder="6 digits [0-9] PIN code" min={100000} max={999999} value={postalCode} onChange={e => {
                                        setPostalCode(+e.target.value.trimEnd())
                                        setPostalCodeError(false)
                                        setAddressError(false)
                                    }} />
                                    {postalCodeError && <p className="text-red-500">Provide a 6 digit postal code</p>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className=" font-semibold" htmlFor="town">Town/City</label>
                                    </div>
                                    <input type="text" id="town" name="town" className={`border-2 ${cityError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} autoComplete="new-password" value={city} onChange={e => {
                                        setCity(e.target.value)
                                        setCityError(false)
                                        setAddressError(false)
                                    }} />
                                    {cityError && <p className="text-red-500">Provide a town</p>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className="font-semibold" htmlFor="state">State</label>
                                    </div>
                                    <select className={`border-2 ${stateError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} name="state" id="state" value={state} onChange={e => {
                                        setState(e.target.value)
                                        setStateError(false)
                                        setAddressError(false)
                                        setDistrict('')
                                        setDistrictError(false)
                                    }}>
                                        <option className="font-semibold" value="" disabled>Select a state</option>
                                        {states.map(state => {
                                            return <option key={state} value={state}>{state}</option>
                                        })}
                                    </select>
                                    {stateError && <p className="text-red-500">Select a state</p>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-0.5">
                                        <p className="h-4 text-2xl text-red-500">*</p>
                                        <label className=" font-semibold" htmlFor="district-chandigarh">District</label>
                                    </div>
                                    <select className={`border-2 ${districtError ? 'border-red-400' : 'border-gray-400'} p-1 rounded`} name="district-chandigarh" id="district-chandigarh" value={district} onChange={e => {
                                        setDistrict(e.target.value)
                                        setDistrictError(false)
                                        setAddressError(false)
                                    }}>
                                        <option className="font-semibold" value="" disabled>Select a district:</option>
                                        {state.toLowerCase() === 'chandigarh' && <option value="CHANDIGARH">CHANDIGARH</option>}
                                        {state.toLowerCase() === 'punjab' && punjabDistricts.map(district => {
                                            return <option key={district} value={district}>{district}</option>
                                        })}
                                    </select>
                                    {districtError && <p className="text-red-500">Select a district</p>}
                                </div>

                                <div className="w-full flex justify-center">
                                    <button type="button" className="bg-green-400 text-white font-medium rounded pl-2 pr-2 h-8" onClick={addAddress}>Add Address</button>
                                </div></>}

                            <div className="w-full text-center flex flex-row flex-wrap place-content-center gap-2 mt-2">
                                {addressArray.length > 0 && addressArray.map(address => {
                                    return <div key={address.addressId} className="bg-gray-200 border-gray-400 rounded w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                        {editDetails && <button className="bg-red-400 text-white font-medium rounded pl-2 pr-2 mb-2 mt-2" onClick={() => {
                                            const updatedAddressArray = addressArray.filter(item => item.addressId !== address.addressId)
                                            setAddressArray(updatedAddressArray)
                                        }}>Remove</button>}
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>

                    {/*gst*/}
                    <div className="flex flex-col p-3  bg-gray-100">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="gst">GST number</label>
                        <input type="text" id="gst" name="gst" className='border-2 border-gray-400 p-1 rounded' disabled={true} value={gstNumber} />
                    </div>

                    {/*RERA number*/}
                    <div className="flex flex-col p-3">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="rera">RERA number</label>
                        <input type="text" id="rera" name="rera" className='border-2  border-gray-400 p-1 rounded' disabled={true} value={reraNumber} />
                    </div>

                    {/*email*/}
                    <div className="flex flex-col p-3  bg-gray-100">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" className='border-2 border-gray-400 p-1 rounded' disabled={true} value={email} />
                    </div>

                    {/*contact number*/}
                    <div className="flex flex-col p-3">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="contactNumber">Contact Number</label>
                        <input type="Number" id="contactNumber" name="contactNumber" className='border-2  border-gray-400 p-1 rounded' disabled={true} value={contactNumber} />
                    </div>

                    {/*about*/}
                    <div className="flex flex-col p-3  bg-gray-100">
                        <label className="text-lg font-semibold mb-0.5" htmlFor="about">About (not more than 150 words)</label>
                        <textarea disabled={!editDetails} className={`border-2 ${aboutMoreThanOneFiftyWords ? 'border-red-400' : 'border-gray-400'} p-1 rounded  w-full  resize-none`} rows={3} autoCorrect="on" autoComplete="new-password" id="story" name="story" value={about} onChange={e => {
                            setAboutMoreThanOneFiftyWords(false)
                            setAbout(e.target.value)
                            const numberOfWordsInAbout = e.target.value.trim().split(/\s+/);
                            if (numberOfWordsInAbout.length > 150) {
                                setAboutMoreThanOneFiftyWords(true)
                            }
                        }} />
                        {aboutMoreThanOneFiftyWords && <p className="text-red-500">About should be less than 150  words</p>}
                    </div>

                    {/*add firm logo*/}
                    <div className="flex flex-row gap-2 p-3">
                        {!editDetails && <p className="text-lg font-semibold mr-16" htmlFor="image">Firm logo</p>}
                        {editDetails && <><label className="text-lg font-semibold" htmlFor="image">Add firm logo</label>
                            <input type='file' className='text-transparent' placeholder="image" accept="image/png, image/jpeg" name='image' onChange={imageChangeHandler} /></>}
                        {firmLogoImageFile && <img className='w-28 h-auto' src={firmLogoImageFile} alt="" />}
                    </div>

                    <div type='submit' className="w-full h-10 flex justify-center mt-4 mb-2">
                        {!editDetails && <button type="submit" className="w-full bg-blue-500 text-white font-medium rounded mr-2 ml-2 h-8" onClick={() => {
                            setEditDetails(true)
                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
                        }}>Edit details</button>}
                        {editDetails && <button type="button" className="w-full bg-green-500 text-white font-medium rounded mr-2 ml-2 h-8">Save Edited Details</button>}
                    </div>
                </div>
            </div>}
        </Fragment>
    )
}
export default PropertyDealerDetails