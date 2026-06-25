import React from "react";

const Input = ({ label, name, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <label className="block text-xs uppercase tracking-widest text-gray-500 font-mono mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
        }}
      />
    </div>
  );
};

export default Input;