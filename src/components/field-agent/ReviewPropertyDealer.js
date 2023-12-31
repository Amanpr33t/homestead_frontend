import { Fragment, useEffect } from "react"

//This component is used to show property dealer details in a table
function ReviewPropertyDealer(props) {
    const { dealer, hideReviewPage } = props

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) //to scroll to the top of the page
    }, [])

    return (
        <Fragment>
            <div className="w-full fixed top-16 bg-white z-20">
                <button type='button' className="bg-green-500 ml-2 mt-2 text-white font-semibold rounded pl-2 pr-2 pt-0.5 h-8  " onClick={hideReviewPage}>Back</button>

                <div className="w-full flex justify-center pb-4">
                    <p className="text-2xl font-bold text-center">Review the details</p>
                </div>
            </div>

            <div className='pl-1 pr-1 pt-40 mb-10 w-full flex flex-col place-items-center' >

                <table className="w-full sm:w-10/12 md:w-9/12 lg:w-7/12 table-auto">
                    <thead >
                        <tr className="bg-gray-200 border-2 border-gray-200">
                            <th className="w-40 text-xl pt-2 pb-2">Field</th>
                            <th className="text-xl ">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm name</td>
                            <td className=" pt-2 pb-2 text-center">{dealer.firmName}</td>
                        </tr>
                       
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Property dealer</td>
                            <td className="pt-2 pb-2 text-center">{dealer.propertyDealerName}</td>
                        </tr>
                        <tr className="border-2 border-gray-300">
                                <td className=" pl-5 pt-2 pb-2 text-lg font-semibold">Dealer ID</td>
                                <td className=" pt-4 pb-4 text-center">{dealer.uniqueId}</td>
                            </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Experience</td>
                            <td className="pt-2 pb-2 text-center">{dealer.experience}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">GST Number</td>
                            <td className="pt-2 pb-2 text-center" >{dealer.gstNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">RERA Number</td>
                            <td className="pt-2 pb-2 text-center" >{dealer.reraNumber}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Address</td>
                            <td className="flex flex-row place-content-center gap-2 flex-wrap pt-2 pb-2 text-center">
                                {dealer.addressArray.map(address => {
                                    return <div key={Math.random()} className="bg-gray-200 border-gray-200 rounded w-60 p-1">
                                        <p className="">{address.flatPlotHouseNumber}, {address.areaSectorVillage}, near {address.landmark}, {address.city}, {address.state}</p>
                                        <p>Pincode: {address.postalCode}</p>
                                    </div>
                                })}
                            </td>
                        </tr>
                        {dealer.about && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">About</td>
                            <td className="pt-2 pb-2 text-center">{dealer.about}</td>
                        </tr>}
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Email</td>
                            <td className="pt-2 pb-2 text-center">{dealer.email}</td>
                        </tr>
                        <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Contact Number</td>
                            <td className="pt-2 pb-2 text-center">{dealer.contactNumber}</td>
                        </tr>
                        {dealer.firmLogoUrl && <tr className="border-2 border-gray-200">
                            <td className="pl-5 pt-2 pb-2 text-lg font-semibold">Firm logo</td>
                            <td className="pt-2 pb-2 flex justify-center">
                                <img className='w-28 h-auto' src={dealer.firmLogoUrl} alt="" />
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>

        </Fragment >
    )
}
export default ReviewPropertyDealer