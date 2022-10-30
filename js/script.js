'use strict';

let formBtnDesignElm = document.querySelector('#butnElm');
formBtnDesignElm.addEventListener('mousedown', ()=> formBtnDesignElm.style.border = '1px solid #2196f3');
formBtnDesignElm.addEventListener('mouseup', ()=> formBtnDesignElm.style.border = '1px solid #fff');


const localStoragesData = {
	country : '',
	city : '',
	saveItem()
	{
		localStorage.setItem('weatherCountry', this.country)
		localStorage.setItem('weatherCity', this.city)
	},
	getItem()
	{
		const country = localStorage.getItem('weatherCountry');
		const city = localStorage.getItem('weatherCity');
		return {
			country,
			city
		}
	}
}
const weatherData = 
{
	country : '',
	city : '',
	API_KEY : 'bb459a9b116eee77f3b727de61f3a4b5',
	async getWeather()
	{
		try
		{
			const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`)
			return await res.json();
			
		}catch(error)
		{
			console.log('error heere'+error)
		}	
	}
}

const UI = 
{
	selectAllElm() 
	{
		const submitBtnElm = document.querySelector('form');
		const countryNameElm = document.querySelector('#countryName');
		const cityNameElm = document.querySelector('#cityName');
		// let formBtnDesignElm = document.querySelector('#butnElm');
		// ui selector start here 
		const countyElm = document.querySelector('.county')
		const cityElm = document.querySelector('.city')
		const tememperatureElm = document.querySelector('.tem');
		const defaultWeatherImgElm = document.querySelector('#defaultWeatherImg');
		const pacharElm = document.querySelector('.pachar');
		const huminityElm = document.querySelector('.huminity');
		const feelElm = document.querySelector('#feel');
		const iconElm = document.querySelector('.icon');
		// error message 
		const cuntryErrorElm = document.querySelector('#cuntryError');
		const cityErrorElm = document.querySelector('#cityError');

		return {
			submitBtnElm,
			countryNameElm,

			cityNameElm,
			countyElm,
			cityElm,
			tememperatureElm,
			defaultWeatherImgElm,
			pacharElm,
			huminityElm,
			feelElm,
			iconElm,

			cuntryErrorElm,
			cityErrorElm
		}
	},
	// validate form
	validate()
	{
		let isValue = false;
		const {countryNameElm,cityNameElm} = this.selectAllElm();
		if(countryNameElm.value === '' || cityNameElm.value === '')
		{
			isValue = true;
		}
		return isValue;
	},
	getInputValue()
	{
		const {countryNameElm,cityNameElm} = this.selectAllElm();
		const country = countryNameElm.value;
		const city = cityNameElm.value;

		return {country,city};
	},
	resetInputField()
	{
		const {countryNameElm,cityNameElm} = this.selectAllElm();
		countryNameElm.value = '';
		cityNameElm.value = '';
	},
	// sate data to localStorage 
	setDataToLocalStorage(country,city)
	{
		localStoragesData.country = country;
		localStoragesData.city = city;
	},
	setInputToUi()
	{
		const {countyElm,cityElm} = this.selectAllElm();
		const {country,city} = this.getInputValue();

		// sendting data to data storage
		weatherData.country = country;
		weatherData.city = city;

		// sate data to localStorage 
		this.setDataToLocalStorage(country,city)
		// saving to local storage 
		localStoragesData.saveItem()

		countyElm.textContent = country;
		cityElm.textContent = city;
	},
	resetError(country,city)
	{
		country.textContent = '';
		city.textContent = '';
	},
	showErrorMsg(country,city)
	{
		const {countryNameElm,cityNameElm} = this.selectAllElm();
		if(countryNameElm.value === '')
		{
			country.textContent = 'Please give country name.';
			country.style.color = 'red';
		}else if(cityNameElm.value === '')
		{
			city.textContent = 'Please give city name.';
			city.style.color = 'red';
		}
	},
	getIcon(iconCodes)
	{
		return `https://openweathermap.org/img/w/${iconCodes}.png`
	},
	populateUI(data) 
	{
		const {
			countyElm,
			cityElm,
			tememperatureElm,
			defaultWeatherImgElm,
			pacharElm,
			huminityElm,
			feelElm,
			iconElm
		} = this.selectAllElm();
		// getting data form api
		const {name, main:{temp,pressure,humidity},weather,sys} = data;

		countyElm.textContent = sys.country
		cityElm.textContent = name;
		tememperatureElm.textContent = temp;
		pacharElm.textContent = pressure;
		huminityElm.textContent = humidity;
		feelElm.textContent = weather[0].description
		iconElm.setAttribute('src',this.getIcon([weather[0].icon]))
	},
   async errorFunc(error)
	{
		const {cuntryErrorElm,cityErrorElm} = this.selectAllElm();
		if(!error)
		{
			// showing inputs value 
			this.getInputValue();
			// show input to ui
			this.setInputToUi();
			// reset input field
			this.resetInputField();
			// reset error message
			this.resetError(cuntryErrorElm,cityErrorElm)
			// resive another function data
			const data = await this.handaleRomoteData();
			// populate to ui 
			this.populateUI(data)
		}
		else
		{
			// showing error message 
			this.showErrorMsg(cuntryErrorElm,cityErrorElm)
		}
	},
	async handaleRomoteData()
	{	
		// resive data form ui
		const data = await weatherData.getWeather();
		return data;
	},
	init()
	{
		const {submitBtnElm} = this.selectAllElm();
		// setting event listener for getting inpur value 
		submitBtnElm.addEventListener('submit',(evt) => 
		{
			evt.preventDefault();
			const isError = this.validate();
			// if we can find any error then we will set a message
			this.errorFunc(isError)
		});
		window.addEventListener('DOMContentLoaded', async() => 
		{
			let {country,city} = localStoragesData.getItem();
			if(!country || !city)
			{
				city = 'Dhaka'
				country = 'Pakistan'
			}
			weatherData.country = country;
			weatherData.city = city;

			const data = await this.handaleRomoteData();
			// populate to ui 
			this.populateUI(data)
		})
	}
}
UI.init();

