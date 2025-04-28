import React, { useState, useEffect } from "react";
import Header from "../../component/common/header/Header";
import Footer from "../../component/common/footer/Footer";
import { userProfile } from "../../api/Auth";
import { User_Authentication } from "../../user_authentication/User_Authentication";
import { useNavigate } from "react-router-dom";
import Images from "../../component/common/images/Images";
import { ImageUrl } from "../../config/Config";
import Loader from "../../loader/Loader";

const UserProfile = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [userprofile, setUserprofile] = useState({})
    console.log("userprofile", userprofile)

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true)
            try {
                const token = User_Authentication();
                if (!token) {
                    setIsLoading(false)
                    throw new Error("user token not found");
                }
                const response = await userProfile({ Authorization: `Bearer ${token}` });
                console.log("response", response);
                if (response?.data?.status === true) {
                    setIsLoading(false)
                    setUserprofile(response?.data?.data);
                   
                }
                else if (response?.response?.data?.status == "401") {
                    setIsLoading(false)
                    localStorage.clear("")
                    navigate("/login")

                }
            } catch (error) {
                setIsLoading(false)
            }
        }
        fetchUserProfile()
    }, [])

    return (
        <>
            <Header />
            {
                isLoading ? <Loader /> :
                    <>
                        <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ marginTop: "100px", marginBottom: "50px" }}>
                            <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
                                {/* Profile Image */}
                                <div className="mx-auto mb-3">
                                    {userprofile?.profile_image ? (
                                        <img
                                            src={`${ImageUrl}${userprofile.profile_image}`}
                                            alt="Profile"
                                            className="border border-secondary rounded-circle"
                                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <img
                                            src={Images?.author} // Default Image
                                            alt="Profile"
                                            className="border border-secondary rounded-circle"
                                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                        />
                                    )}
                                </div>

                                {/* User Details */}
                                <h4 className="fw-bold text-dark">Name: {userprofile?.name}</h4>
                                <div className="px-2">

                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>Email:</strong> <span>{userprofile?.email}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>Phone:</strong> <span>{userprofile?.mobile}</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>Gender:</strong> <span>{userprofile?.gender}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </>
            }

            <Footer />
        </>
    );
};

export default UserProfile;
