import ReactCountryFlag from "react-country-flag";

const CountryFlag = ({country,scale}) =>{
    return (
            <ReactCountryFlag
                className="emojiFlag"
                countryCode={country?.value|| "US"}
                style={{
                    scale: scale,
                    fontSize: '1.5em',
                    lineHeight: '1.5em',
                }}
                aria-label={country?.label}
            />
    );
};

export default CountryFlag;
