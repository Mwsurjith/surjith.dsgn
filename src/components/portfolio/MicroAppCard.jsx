'use client';

const MicroAppCard = ({ logo, name, bgColor, onClick }) => {
    return (
        <div
            className="flex flex-col items-center gap-2 p-3 cursor-pointer group hover:bg-zinc-700/50 rounded-2xl transition-all duration-200"
            onClick={onClick}
        >
            {/* App Logo Container */}
            <div className={`flex w-20 h-20 rounded-xl justify-center items-center overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
                <img
                    src={logo}
                    alt={name}
                    className="w-full h-full object-contain opacity-30 transition-all duration-300 group-hover:opacity-100"
                />
            </div>

            {/* App Name */}
            <span className="text-[11px] font-medium text-zinc-400 text-center leading-tight transition-colors duration-200 group-hover:text-white max-w-[80px]">
                {name}
            </span>
        </div>
    );
};

export default MicroAppCard;

