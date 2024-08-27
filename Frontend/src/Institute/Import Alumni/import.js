import React, { useState } from "react";
import { shallowEqual, useSelector } from 'react-redux';
import { notifyError_with_msg, notify_Success_msg } from '../Utils/Message';
import './importStyles.css'; // Add this line to import the new CSS file

const Import = () => {
    const { token, user } = useSelector(state => ({
        token: state.Auth_token,
        user: state.Auth_user,
    }), shallowEqual);

    const [excel, setExcel] = useState('');

    const onChange = (event) => {
        setExcel(event.target.files[0]);
    };

    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        if (!excel) {
            notifyError_with_msg("Please select an Excel file.");
            return;
        }

        const data = new FormData();
        data.append('excel', excel);

        const values = {
            method: "POST",
            headers: {
                'x-auth': token,
            },
            body: data,
        };

        try {
            const response = await fetch(`http://localhost:4000/${user}/insertAlumniExcel`, values);
            const json = await response.json();
            if (!response.ok) {
                notifyError_with_msg(json.err);
            } else {
                notify_Success_msg("Successfully Imported");
                console.log(json)
            }
        } catch (error) {
            notifyError_with_msg("Unable To Import");
        }
    };

    return (
        <div className="import-container">
            <h5 className="import-title">Import Alumni</h5>
            <form className="import-form" onSubmit={onSubmit}>
                <label className="import-label">
                    <span>Only Excel Sheet...</span>
                    <input
                        required
                        name='excel'
                        type='file'
                        accept='.xls, .xlsx'
                        onChange={onChange}
                        className="import-input"
                    />
                </label>
                <button type='submit' className="import-button">Submit</button>
            </form>
        </div>
    );
};

export default Import;
