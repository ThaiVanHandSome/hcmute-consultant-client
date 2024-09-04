export default function ForgotPassword() {
  return (
    <div className='h-[100vh]'>
      <div className='grid grid-cols-12 h-full'>
        <div className='col-span-5 px-6 py-4'>
          <h1 className='font-bold text-xl mb-4 text-center'>Quên mật khẩu</h1>
          <div>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='mt-4'>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input placeholder='Mật khẩu' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full mt-4'>
                  Đăng nhập
                </Button>
                <div className='mt-3 text-center text-sm'>
                  Bạn chưa có tài khoản?{' '}
                  <Link
                    to={{
                      pathname: path.register,
                      search: createSearchParams({
                        status: registerStatus.create
                      }).toString()
                    }}
                    className='font-bold'
                  >
                    Đăng ký
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className='col-span-7'>
          <img src={BackgroundImage} alt='bg' className='w-full h-full bg-center' />
        </div>
      </div>
    </div>
  )
}
