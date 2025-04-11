// src/utils/notification.js
import { toast } from 'react-toastify';

export const notify = (msg, type) => {
  const config = {
    position: 'bottom-center',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  if (type === 'success') {
    toast.success(msg, config);
  } else {
    toast.warning(msg, config);
  }
};
