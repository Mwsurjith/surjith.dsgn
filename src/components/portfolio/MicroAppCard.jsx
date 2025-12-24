'use client';

const MicroAppCard = ({ logo, name, bgColor, onClick }) => {
    return (
        <div
            className="flex flex-col items-center gap-3 cursor-pointer group"
            onClick={onClick}
        >
            {/* App Logo */}
            <div className={`flex w-20 h-20 rounded-2xl justify-center items-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${bgColor || 'transparent'}`}>
                <img
                    src={logo}
                    alt={name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* App Name */}
            <span className="text-sm font-medium text-white/40 text-center transition-colors duration-300 group-hover:text-white">
                {name}
            </span>
        </div>
    );
};

export default MicroAppCard;

