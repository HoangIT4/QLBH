import React from "react";
import '@styles/Header.css'

export default function Header() {
    return (
        <div className="header">
      <span
          className="header-title"
          onClick={() => window.location.href = "/"}
      >
        Trang chủ
      </span>
            <div>
                <button
                    className="header-btn"
                    onClick={() => window.location.href = "/login"}
                >
                    LOGIN
                </button>
                {/* Nếu muốn có nút đăng ký luôn */}
            </div>
        </div>
    );
}
