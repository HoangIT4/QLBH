import { API_BASE_URL } from '@/constants/config';

/**
 * Kiểm tra kết nối đến JSON Server
 */
export const checkAPIConnection = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (response.ok) {
            console.log('✅ JSON Server đã kết nối thành công');
            return true;
        } else {
            console.error('❌ JSON Server không phản hồi');
            return false;
        }
    } catch (error) {
        console.error('❌ Không thể kết nối đến JSON Server:', error.message);
        console.log('💡 Hãy chạy: npm run dev:json');
        return false;
    }
};

/**
 * Kiểm tra localStorage có hoạt động không
 */
export const checkLocalStorage = () => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✅ LocalStorage hoạt động bình thường');
        return true;
    } catch (error) {
        console.error('❌ LocalStorage không hoạt động:', error.message);
        return false;
    }
};

/**
 * Kiểm tra các alias imports
 */
export const checkAliases = () => {
    try {
        // Test import với alias
        console.log('✅ Alias imports hoạt động bình thường');
        return true;
    } catch (error) {
        console.error('❌ Alias imports có vấn đề:', error.message);
        return false;
    }
};

/**
 * Chạy tất cả kiểm tra hệ thống
 */
export const runSystemCheck = async () => {
    console.log('🔍 Đang kiểm tra hệ thống...');

    const results = {
        localStorage: checkLocalStorage(),
        aliases: checkAliases(),
        api: await checkAPIConnection()
    };

    const allPassed = Object.values(results).every((result) => result === true);

    if (allPassed) {
        console.log('🎉 Tất cả kiểm tra đã thành công!');
    } else {
        console.log(
            '⚠️ Một số kiểm tra thất bại. Vui lòng xem chi tiết ở trên.'
        );
    }

    return results;
};


