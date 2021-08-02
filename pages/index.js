import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Form, Input, notification, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationSearchInput from '../components/shared/location-search';
import Router from 'next/router';

const Home = () => {
	const [address, setAddress] = useState('');
	const [errorClass, setErrorClass] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');

	useEffect(() => {
		fetch(`http://54.177.158.210:3005/apiv1/categories/getCategory`)
			.then((res) => res.json())
			.then((res) => {
				if (res.status) {
					setCategories(res.data);
				} else {
					setCategories([]);
				}
			});
	}, []);

	const formRef = React.createRef();

	const clearAddress = () => {
		// Clear with this.props.form.setFieldsValue();
	};

	const modalShow = (type, msg, desc) => {
		notification[type]({
			message: msg,
			description: desc,
			duration: 1,
		});
	};

	const handleAddressChange = (address) => {
		// Do something with address
		setAddress(address);
		formRef.current.setFieldsValue({
			address: address,
		});
	};

	const handleAddressSelect = (address, placeID) => {
		geocodeByAddress(address)
			.then(async (results) => {
				// Do something with results[0]
				if (results.length) {
					if (formRef.current) {
						formRef.current.setFieldsValue({
							address: results[0].formatted_address,
						});
	
						if (results[0].address_components.length) {
							for (var i = 0; i < results[0].address_components.length; i++) {
								if (results[0].address_components[i].types[0] == 'locality') {
									formRef.current.setFieldsValue({
										city: results[0].address_components[i].long_name,
									});
								}
								if (results[0].address_components[i].types[0] == 'administrative_area_level_1') {
									formRef.current.setFieldsValue({
										state: results[0].address_components[i].long_name,
									});
								}
								if (results[0].address_components[i].types[0] == 'country') {
									formRef.current.setFieldsValue({
										country: results[0].address_components[i].long_name,
									});
								}
							}
						}
					}
					setAddress(results[0].formatted_address);
				}

				return getLatLng(results[0]);
			})
			.then((latLng) => {
				setLat(latLng.lat);
				setLng(latLng.lng);
			})
			.catch((error) => {
				console.error('Error', error);
			});
	};

	const handleSubmit = (values) => {
		const baseDomain = `${process.env.API_URL}`;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('media_file', file);
		});

		formData.append('poc', 'poc');
		formData.append('address', values.address);
		formData.append('categories_ids', values.categories_ids);
		formData.append('city', values.city);
		formData.append('country', values.country);
		formData.append('email', values.email);
		formData.append('name', values.name);
		formData.append('password', values.password);
		formData.append('phone', values.phone);
		formData.append('state', values.state);
		formData.append('zipcode', values.zipcode);
		formData.append('latitude', lat);
		formData.append('longitude', lng);

		fetch(`http://54.177.158.210:3005/apiv1/service_provider/addServiceProvider`, {
			body: formData,
			method: 'post',
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.status) {
					setErrorClass('success');
					setErrorMsg('Successfully submited');
					setTimeout(function () {
						setErrorClass('');
						setErrorMsg('');
						Router.reload(window.location.pathname);
					}, 1500);
					// modalShow('success', 'Success', 'Successfully submited');
					//formRef.resetFields();
					Router.reload(window.location.pathname);
				} else {
					setErrorClass('danger');
					setErrorMsg(res.message);
					setTimeout(function () {
						setErrorClass('');
						setErrorMsg('');
					}, 1500);
					// modalShow('error', 'Error', res.message);
				}
			});
	};

	const props = {
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			setFileList([file]);
			return false;
		},
		fileList,
	};

	return (
		<div className="container">
			<Head>
				<title>Queue App</title>
				<link rel="icon" href="/favicon.ico" />
				<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCvKlVyVvzlPtc8Orthx0tJFQNUfxFZsTo&libraries=places"></script>
			</Head>
			<div className="row">
				<div className="pt-5 col-lg-8 col-md-8 col-xs-8 col-sm-8 offset-sm-2">
					<h2>Service Provider</h2>
					<div className={'alert alert-' + errorClass}>{errorMsg}</div>
					<Form onFinish={handleSubmit} ref={formRef}>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="name"
										label="Name"
										rules={[
											{
												required: true,
												message: 'Please enter your name',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="Name" />
									</Form.Item>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="email"
										label="Email"
										rules={[
											{
												required: true,
												message: 'Please enter your email',
											},
										]}
									>
										<Input className="form-control" type="email" placeholder="Email" />
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="phone"
										label="Phone"
										rules={[
											{
												required: true,
												message: 'Please enter your phone',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="Phone" />
									</Form.Item>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="password"
										label="Password"
										rules={[
											{
												required: true,
												message: 'Please enter your password',
											},
										]}
									>
										<Input className="form-control" type="password" placeholder="Password" />
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="categories_ids"
										label="Categories"
										rules={[
											{
												required: true,
												message: 'Please select any on categories',
											},
										]}
									>
										<Select
											mode="multiple"
											style={{ width: '100%' }}
											placeholder="select one category"
											defaultValue={[]}
											optionLabelProp="label"
										>
											{categories.map((category) => {
												return (
													<Option label={category.name} key={category.id} value={category.id}>
														{category.name}
													</Option>
												);
											})}
										</Select>
									</Form.Item>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Upload {...props} maxCount={1}>
										<Button icon={<UploadOutlined />}>Select Logo Icon</Button>
									</Upload>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<div className="form-group">
									<Form.Item
										name="address"
										label="Address"
										rules={[
											{
												required: true,
												message: 'Please enter your address',
											},
										]}
									>
										<LocationSearchInput
											key={0}
											address={address}
											clearAddress={clearAddress}
											onChange={handleAddressChange}
											onAddressSelect={handleAddressSelect}
										/>
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="state"
										label="State"
										rules={[
											{
												required: true,
												message: 'Please enter your state',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="State" />
									</Form.Item>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="city"
										label="City"
										rules={[
											{
												required: true,
												message: 'Please enter your city',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="City" />
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="country"
										label="Country"
										rules={[
											{
												required: true,
												message: 'Please enter your country',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="Country" />
									</Form.Item>
									<Form.Item name="poc">
										<Input type="hidden" initialValues="poc" />
									</Form.Item>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
								<div className="form-group">
									<Form.Item
										name="zipcode"
										label="Zipcode"
										rules={[
											{
												required: true,
												message: 'Please enter your zipcode',
											},
										]}
									>
										<Input className="form-control" type="text" placeholder="Zipcode" />
									</Form.Item>
									<Form.Item name="poc">
										<Input type="hidden" initialValues="poc" />
									</Form.Item>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<button type="submit" className="btn btn-primary">
									Submit
								</button>
							</div>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Home;
