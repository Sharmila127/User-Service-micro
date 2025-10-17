export const successResponse = (res, payload = {}, status = 200) => {
  return res.status(status).json({ success: true, data: payload });
};
