import { useState, useEffect } from "react";

interface CountryOption {
	id: string;
	code: string;
	country: string;
	flag: string;
	iso2: string;
}

interface CountryResponse {
	error: boolean;
	msg: string;
	data: {
		name: string;
		code: string;
		dial_code: string;
	}[];
}

export const useCountries = () => {
	const [countries, setCountries] = useState<CountryOption[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await fetch(
					"https://countriesnow.space/api/v0.1/countries/codes"
				);
				const { data } = (await response.json()) as CountryResponse;

				// Create a Map to store unique dial codes
				const uniqueDialCodes = new Map();

				data.forEach((item) => {
					const dialCode = item.dial_code.replace("+", "");
					if (!uniqueDialCodes.has(dialCode)) {
						uniqueDialCodes.set(dialCode, {
							id: `${item.code}-${dialCode}`,
							code: dialCode,
							country: item.name,
							flag: `https://flagcdn.com/w20/${item.code.toLowerCase()}.png`,
							iso2: item.code.toLowerCase(),
						});
					}
				});

				const formattedCountries = Array.from(uniqueDialCodes.values()).sort(
					(a, b) => a.country.localeCompare(b.country)
				);

				setCountries(formattedCountries);
			} catch (err) {
				setError("Failed to fetch countries");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCountries();
	}, []);

	return { countries, isLoading, error };
};
