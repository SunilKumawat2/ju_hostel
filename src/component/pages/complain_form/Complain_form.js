import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import { complaint_list, complaint_Submit } from "../../../api/Complain_Form";
import { User_Authentication } from "../../../user_authentication/User_Authentication";
import { useNavigate } from "react-router-dom";
import { hostelList } from "../../../api/Global";
import ReadMore from "../../common/read_more/Read_More";
import Loader from "../../../loader/Loader";
import ClipLoader from "react-spinners/ClipLoader";

const ComplainForm = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [is_Button_Loading, setIs_Button_Loading] = useState(false)
    const [hostel_list, set_hostel_list] = useState([]);
    const [get_comp_list, set_Get_Comp_List] = useState([]);

    const [formData, setFormData] = useState({
        hostel_id: '',
        title: '',
        subject: '',
        description: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIs_Button_Loading(true)
        const token = User_Authentication();
        if (!token) {
            setIs_Button_Loading(false)
            setTimeout(() => {
                navigate("/login")
            }, 2000);
        }

        // Check for empty fields
        for (const key in formData) {
            if (formData[key] === '') {
                toast.error('Please fill in all fields.');
                setIs_Button_Loading(false)
                return;
            }
        }

        //<-------- Convert formData state to FormData instance ---------------->
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await complaint_Submit(formDataToSend, { Authorization: `Bearer ${token}` });
            if (response.data?.status == "200") {
                setIs_Button_Loading(false)
                toast.success(response?.data?.message);
                Get_Complaint_list();
                setFormData({
                    hostel_id: '',
                    title: '',
                    subject: '',
                    description: '',
                });
            } else {
                toast.error('Failed to submit complaint.');
                setIs_Button_Loading(false)
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            setIs_Button_Loading(false)
        }
    };

    // <----------- fetch the hostel list ------------>
    useEffect(() => {
        const Get_Hostel_list = async () => {
            try {
                const response = await hostelList();
                set_hostel_list(response?.data?.data?.hostels)
            }
            catch (error) {
                console.log("error", error)
            }
        }
        Get_Hostel_list()
    }, [])

    // <------ Get Complaint list ----------->
    const Get_Complaint_list = async () => {
        setIsLoading(true)
        const token = User_Authentication();
        if (!token) {
            toast.error("User is not logged in.");
        }
        try {
            const response = await complaint_list({ Authorization: `Bearer ${token}` });
            set_Get_Comp_List(response?.data?.data?.complaint)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
        }
    }

    // <--------- fetch the Complaint list -------------->
    useEffect(() => {
        Get_Complaint_list();
    }, [])
    return (
        <>
            <Header />
            <br />
            <br />
            <br />
            <br />
            <div className="d-flex justify-content-center mt-4">
                <div className="col-md-6">
                    <h3 className="text-center mb-4">Complaint Form</h3>
                    <div className="card shadow p-4">
                        <form onSubmit={handleSubmit}>
                            {/* <!-- Hostel & Title in One Row --> */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Select Hostel</label>
                                    <select className="form-select" name="hostel_id" onChange={handleChange}>
                                        <option value="">Select Hostel</option>
                                        {hostel_list?.map((hostel_list_result) => (
                                            <option value={hostel_list_result?.id}>
                                                {hostel_list_result?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Complaint Title</label>
                                    <select className="form-select" name="title" value={formData.title} onChange={handleChange}>
                                        <option value="">Select Title</option>
                                        <option value="Maintenance Issue">Maintenance Issue</option>
                                        <option value="Cleanliness Issue">Cleanliness Issue</option>
                                        <option value="Security Concern">Security Concern</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            {/* <!-- Subject --> */}
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label className="form-label">Subject</label>
                                    <input type="text" className="form-control" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject" />
                                </div>
                            </div>
                            {/* <!-- Details --> */}
                            <div className="mb-3">
                                <label className="form-label">Details</label>
                                <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Describe your complaint"></textarea>
                            </div>
                            {/* <!-- Submit Button --> */}
                            <div className="text-center">
                                <button type="submit" className="btn btn-danger js-btn-next text-white" disabled={is_Button_Loading}>
                                    {is_Button_Loading ? (
                                        <ClipLoader color="#ffffff" size={20} />
                                    ) : (
                                        "Submit Complaint"
                                    )}

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <br />
            <br />
            {
                get_comp_list?.length > 0 && (
                    <>
                        {
                            isLoading ? <Loader /> : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Complaint No.</th>
                                                <th>Title</th>
                                                <th>Subject</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {get_comp_list?.map((get_comp_list_result, index) => {
                                                return (
                                                    <tr key={get_comp_list_result?.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{get_comp_list_result?.complaint_number}</td>
                                                        <td>{get_comp_list_result?.title}</td>
                                                        <td>
                                                            <ReadMore text={get_comp_list_result?.subject} maxLines={2} />
                                                        </td>
                                                        <td>
                                                            <ReadMore text={get_comp_list_result?.description} maxLines={2} />
                                                        </td>
                                                        <td className={get_comp_list_result?.status == '1' ? 'text-warning' : 'text-success'}>
                                                            {get_comp_list_result.status == '1' ? 'Pending' : 'Closed'}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                            )
                        }
                    </>
                )
            }


            <Footer />
        </>
    );
};

export default ComplainForm;
