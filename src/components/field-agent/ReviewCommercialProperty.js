import { Fragment, useCallback, useEffect, useState } from "react"
import Spinner from "../Spinner"
import { useNavigate } from "react-router-dom"

//This component is used to show a commercial property details in a table
function ReviewCommercialProperty(props) {
    const navigate = useNavigate()
    const { property, hideReviewPage } = props

    const [spinner, setSpinner] = useState(true)
    const [error, setError] = useState(false)
    const [firmName, setFirmName] = useState()
    
    const authToken = localStorage.getItem("homestead-field-agent-authToken")

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) //used to scroll to top of the screen
    }, [])

    //the function is used to get the firmName of a proeprty dealer
    const getPropertyDealer = useCallback(async () => {
        try {
            setSpinner(true)
            setError(false)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/field-agent/propertyDealerOfaProperty/${property.addedByPropertyDealer
                }`, {
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
            if (data.status === 'invalid_authentication') {
                setSpinner(false)
                localStorage.removeItem("homestead-field-agent-authToken")
                navigate('/field-agent/signIn', { replace: true })
            } else if (data.status === 'ok') {
                setSpinner(false)
                setFirmName(data.firmName)
            }
        } catch (error) {
            setError(true)
            setSpinner(false)
        }
    }, [property.addedByPropertyDealer, authToken, navigate])

    useEffect(() => {
        getPropertyDealer()
    }, [getPropertyDealer])

    return (
        <Fragment>
            {spinner && !error && <Spinner />}

            {!spinner &&
                <div className="w-full fixed top-16 bg-white pb-2 z-50">
                    <button type='button' className="bg-green-500  ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8 " onClick={hideReviewPage}>Back</button>
                </div>
            }

            {error && !spinner && <>
                <div className="fixed top-32 w-full flex flex-col place-items-center">
                    <p>Some error occured</p>
                    <p className="text-red-500 cursor-pointer" onClick={getPropertyDealer}>Try again</p>
                </div>
            </>}

            {!error && !spinner && firmName && <>
                <div className="w-full mt-28 bg-white z-20 mb-4">
                    <p className="text-2xl font-bold text-center">Commercial property details</p>
                </div>

                <div className='pl-1 pr-1 mb-10 w-full flex flex-col place-items-center' >
                    <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto" onClick={e => e.stopPropagation()}>
                        <thead >
                            <tr className="bg-gray-200 border-2 border-gray-300">
                                <th className="w-28 text-xl pt-4 pb-4 sm:w-fit">Field</th>
                                <th className="text-xl ">Data</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Firm name</td>
                                <td className=" pt-4 pb-4 text-center">{firmName}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property ID</td>
                                <td className=" pt-4 pb-4 text-center">{property.uniqueId}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Property type</td>
                                <td className=" pt-4 pb-4 text-center">{property.commercialPropertyType === 'industrial' ? 'Industrial/Institutional' : 'Shop/Showroom/Booth'}</td>
                            </tr>

                            {property.commercialPropertyType === 'shop' && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Shop type</td>
                                <td className=" pt-4 pb-4 text-center">{property.shopPropertyType}</td>
                            </tr>}

                            {property.commercialPropertyType === 'industrial' ? <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : `${property.stateOfProperty.builtUpPropertyType === 'other' ? 'Built-up' : `Built-up (${property.stateOfProperty.builtUpPropertyType})`}`}</td>
                            </tr> : <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">State of property</td>
                                <td className=" pt-4 pb-4 text-center">{property.stateOfProperty.empty ? 'Empty' : 'Built-up'}</td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Land Size</td>
                                <td className="pt-4 pb-4 text-center pr-0.5 pl-0.5">
                                    <div className="flex flex-row place-content-center gap-1 sm:gap-5 mb-4">
                                        <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                            <p className="w-full text-center font-semibold">Total area</p>
                                            <p>{property.landSize.totalArea.metreSquare} metre square</p>
                                            <p>{property.landSize.totalArea.squareFeet} square feet</p>
                                        </div>
                                        <div className="flex flex-col gap-3 bg-gray-200 w-fit p-2 pt-0">
                                            <p className="w-full text-center font-semibold">Covered area</p>
                                            <p>{property.landSize.coveredArea.metreSquare} metre square</p>
                                            <p>{property.landSize.coveredArea.squareFeet} square feet</p>
                                        </div>
                                    </div>

                                    {property.landSize.details && < p > {property.landSize.details}</p>}
                                </td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Floors (excluding basement)</td>
                                <td className=" pt-4 pb-4 text-center">{property.floors.floorsWithoutBasement}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Basement floors</td>
                                <td className=" pt-4 pb-4 text-center">{property.floors.basementFloors}</td>
                            </tr>

                            {property.commercialPropertyType === 'shop' && (property.leasePeriod.years!==0 || property.leasePeriod.months!==0) && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lease period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {property.leasePeriod.years !== 0 && <p>{property.leasePeriod.years} years</p>}
                                        {property.leasePeriod.months !== 0 && <p>{property.leasePeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                            {property.commercialPropertyType === 'shop' && (property.lockInPeriod.years!==0 || property.lockInPeriod.months!==0) && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Lock-in period</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col">
                                        {property.lockInPeriod.years !== 0 && <p>{property.lockInPeriod.years} years</p>}
                                        {property.lockInPeriod.months !== 0 && <p>{property.lockInPeriod.months} months</p>}
                                    </div>
                                </td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Location</td>
                                <td className="pt-4 pb-4 flex flex-col gap-1 place-items-center">
                                    {property.location.name.plotNumber && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Plot number:</p>
                                        <p>{property.location.name.plotNumber}</p>
                                    </div>}
                                    {property.location.name.village && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">Village:</p>
                                        <p>{property.location.name.village}</p>
                                    </div>}
                                    {property.location.name.city && <div className="flex flex-row gap-2">
                                        <p className="font-semibold">City:</p>
                                        <p>{property.location.name.city}</p>
                                    </div>}
                                    {property.location.name.tehsil && <div className="flex flex-row gap-2">
                                        <h2 className="font-semibold">Tehsil:</h2>
                                        <p>{property.location.name.tehsil}</p>
                                    </div>}
                                    <div className=" flex flex-row gap-2">
                                        <p className="font-semibold">District:</p>
                                        <p>{property.location.name.district}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <p className="font-semibold">State:</p>
                                        <p>{property.location.name.state}</p>
                                    </div>
                                </td>
                            </tr>

                            {property.widthOfRoadFacing.metre && property.widthOfRoadFacing.feet && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Road width</td>
                                <td className=" pt-4 pb-4 text-center">
                                    <div className="flex flex-col place-items-center">
                                        <p>{property.widthOfRoadFacing.feet}   feet</p>
                                        <p>{property.widthOfRoadFacing.metre}  metre</p>
                                    </div>
                                </td>
                            </tr>}

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Number of owners</td>
                                <td className="pt-4 pb-4 text-center" >{property.numberOfOwners}</td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Price</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    <div className="flex flex-row place-content-center gap-1">
                                        <p className="font-semibold">Rs.</p>
                                        <p>{property.priceDemanded.number}</p>
                                    </div>
                                    <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.priceDemanded.words}</p>
                                </td>
                            </tr>

                            <tr className="border-2 border-gray-300">
                                <td className="pt-4 pb-4 text-lg font-semibold text-center">Legal Restrictions</td>
                                <td className="pt-4 pb-4 text-center flex flex-col gap-2">
                                    {!property.legalRestrictions.isLegalRestrictions && <p>No</p>}
                                    {property.legalRestrictions.isLegalRestrictions && <>
                                        <p>Yes</p>
                                        <p className="mr-2 sm:mr-5 mr-2 sm:ml-5 bg-gray-200">{property.legalRestrictions.details}</p>
                                    </>}
                                </td>
                            </tr>

                            {property.remarks && <tr className="border-2 border-gray-300">
                                <td className=" pt-4 pb-4 text-lg font-semibold text-center">Remarks</td>
                                <td className=" pt-4 pb-4 text-center">{property.remarks}</td>
                            </tr>}
                            <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Land Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.propertyImagesUrl.map(image => {
                                            return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />;
                                        })}
                                </td>
                            </tr>
                            {property.contractImagesUrl.length > 0 && <tr className="border-2 border-gray-200">
                                <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contract Images</td>
                                <td className="pt-2 pb-2 flex justify-center flex-wrap gap-2">
                                    {property.contractImagesUrl.map(image => {
                                        return <img key={Math.random()} className='w-40 h-auto border border-gray-500' src={image} alt="" />
                                    })}
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div></>}

        </Fragment >
    )
}
export default ReviewCommercialProperty